import {Buffer} from 'buffer'
import CardanoWalletLib from 'cardano-wallet'
import { Bip32PrivateKey, Seed, ShelleyWallet, WalletServer } from 'cardano-wallet-js'
import Cardano from '../../lib/@emurgo/cardano-multiplatform-lib-nodejs';
import * as  bip39 from 'bip39';

import { CREATE_WALLET, IMPORT_WALLET, GET_BALANCES, GET_BALANCE, SEND_COIN, ERRORS } from '../../utils/constant'
import { AnyObject } from '../../utils/globalType'
import { response, walletResponse, balanceResponse } from '../../utils/response';
import { harden, getBalanceExtended, blockfrostRequest, getUtxos } from '../../helper/cardanoHelper';

const createWallet = async () => {
    const mnemonic = bip39.generateMnemonic()
    const entropy = bip39.mnemonicToEntropy(mnemonic)
    const rootKey = Cardano.Bip32PrivateKey.from_bip39_entropy(Buffer.from(entropy, 'hex'), Buffer.from(''))

    const rootKeyBytes = rootKey.as_bytes()

    const accountKey = Cardano.Bip32PrivateKey.from_bytes(rootKeyBytes).derive(harden(1852)).derive(harden(1815)).derive(harden(0))
    const paymentKey = accountKey.derive(0).derive(0).to_raw_key()
    const stakeKey = accountKey.derive(2).derive(0).to_raw_key()

    const publicKey = Buffer.from(accountKey.to_public().as_bytes()).toString('hex')
    const paymentPubKey = paymentKey.to_public()
    const stakePubkey = stakeKey.to_public()

    const paymentKeyHash = Buffer.from(paymentPubKey.hash().to_bytes()).toString('hex')
    const paymentKeyHashBech32 = paymentPubKey.hash().to_bech32('addr_vkh')

    const stakeKeyHash = Buffer.from(stakePubkey.hash().to_bytes()).toString('hex')

    const paymentAddrMainnet = Cardano.BaseAddress.new(
        Cardano.NetworkInfo.mainnet().network_id(),
        Cardano.StakeCredential.from_keyhash(paymentPubKey.hash()),
        Cardano.StakeCredential.from_keyhash(stakePubkey.hash())
    ).to_address().to_bech32()

    const rewardAddrMainnet = Cardano.RewardAddress.new(
        Cardano.NetworkInfo.mainnet().network_id(),
        Cardano.StakeCredential.from_keyhash(stakePubkey.hash())
    ).to_address().to_bech32()

    const paymentAddrTestnet = Cardano.BaseAddress.new(
        Cardano.NetworkInfo.testnet().network_id(),
        Cardano.StakeCredential.from_keyhash(paymentPubKey.hash()),
        Cardano.StakeCredential.from_keyhash(stakePubkey.hash())
    ).to_address().to_bech32()

    const rewardAddrTestnet = Cardano.RewardAddress.new(
        Cardano.NetworkInfo.testnet().network_id(),
        Cardano.StakeCredential.from_keyhash(stakePubkey.hash())
    ).to_address().to_bech32()

    return response({
        mnemonic,
        address: paymentAddrMainnet,
        publicKey,
        privateKey: accountKey.to_bech32(),
        paymentKey,
        stakeKey,
        paymentKeyHash,
        stakeKeyHash,
        paymentKeyHashBech32,
        testnetAddress: paymentAddrTestnet
    })
}

const importWallet = async (mnemonic: string, index?: number) => {
    const entropy = bip39.mnemonicToEntropy(mnemonic)
    const rootKey = Cardano.Bip32PrivateKey.from_bip39_entropy(Buffer.from(entropy, 'hex'), Buffer.from(''))

    const rootKeyBytes = rootKey.as_bytes()

    const accountKey = Cardano.Bip32PrivateKey.from_bytes(rootKeyBytes).derive(harden(1852)).derive(harden(1815)).derive(harden(0))
    const paymentKey = accountKey.derive(0).derive(index || 0).to_raw_key()
    const stakeKey = accountKey.derive(2).derive(0).to_raw_key()

    const publicKey = Buffer.from(accountKey.to_public().as_bytes()).toString('hex')
    const paymentPubKey = paymentKey.to_public()
    const stakePubkey = stakeKey.to_public()

    const paymentKeyHash = Buffer.from(paymentPubKey.hash().to_bytes()).toString('hex')
    const paymentKeyHashBech32 = paymentPubKey.hash().to_bech32('addr_vkh')

    const stakeKeyHash = Buffer.from(stakePubkey.hash().to_bytes()).toString('hex')

    const paymentAddrMainnet = Cardano.BaseAddress.new(
        Cardano.NetworkInfo.mainnet().network_id(),
        Cardano.StakeCredential.from_keyhash(paymentPubKey.hash()),
        Cardano.StakeCredential.from_keyhash(stakePubkey.hash())
    ).to_address().to_bech32()

    const rewardAddrMainnet = Cardano.RewardAddress.new(
        Cardano.NetworkInfo.mainnet().network_id(),
        Cardano.StakeCredential.from_keyhash(stakePubkey.hash())
    ).to_address().to_bech32()

    const paymentAddrTestnet = Cardano.BaseAddress.new(
        Cardano.NetworkInfo.testnet().network_id(),
        Cardano.StakeCredential.from_keyhash(paymentPubKey.hash()),
        Cardano.StakeCredential.from_keyhash(stakePubkey.hash())
    ).to_address().to_bech32()

    const rewardAddrTestnet = Cardano.RewardAddress.new(
        Cardano.NetworkInfo.testnet().network_id(),
        Cardano.StakeCredential.from_keyhash(stakePubkey.hash())
    ).to_address().to_bech32()

    return response({
        mnemonic,
        address: paymentAddrMainnet,
        publicKey,
        privateKey: accountKey.to_bech32(),
        paymentKey,
        stakeKey,
        paymentKeyHash,
        stakeKeyHash,
        paymentKeyHashBech32,
        testnetAddress: paymentAddrTestnet
    })
}

const getBalances = async (address: string, network?: 'mainnet' | 'testnet' | 'preprod' | 'preview') => {
    const balances = await getBalanceExtended(address, network || 'mainnet')

    return response( balances )
}   

const getBalance = async (address: string, network?: 'mainnet' | 'testnet' | 'preprod' | 'preview') => {
    const balances: [object] = await getBalanceExtended(address, network || 'mainnet')
    const ada: any = balances.filter((asset: any) => asset['unit'] === 'lovelace')
    const safeAdaBalance: number = ada[0]['quantity'] / 10 ** ada[0]['decimals']

    return balanceResponse( safeAdaBalance )
}

const sendAda = async (paymentKey: any, fromAddress: string, toAddress: string, amount: number, network?: 'mainnet' | 'testnet' | 'preprod' | 'preview') => {
    const protocolParameters: any = await blockfrostRequest(`/epochs/latest/parameters`, network || 'mainnet');
    const latest_block = await blockfrostRequest('/blocks/latest', network || 'mainnet');

    const coinsPerUtxoWord: string = protocolParameters.coins_per_utxo_size.toString()
    const minFeeA: string = protocolParameters.min_fee_a.toString()
    const minFeeB: string = protocolParameters.min_fee_b.toString()
    const keyDeposit = protocolParameters.key_deposit
    const poolDeposit = protocolParameters.pool_deposit
    const maxTxSize = parseInt(protocolParameters.max_tx_size)
    const maxValueSize = protocolParameters.max_val_size
    const collateralPercentage = parseInt(protocolParameters.collateral_percent)
    const maxCollateralInput = parseInt(protocolParameters.max_collateral_inputs)
    const slot = parseInt(latest_block.slot)

    const transactionOutputs = Cardano.TransactionOutputs.new()
    transactionOutputs.add(
        Cardano.TransactionOutput.new(Cardano.Address.from_bech32(toAddress), Cardano.Value.new(Cardano.BigNum.from_str(amount.toString())))
    )

    const txBuilderConfig = Cardano.TransactionBuilderConfigBuilder.new().coins_per_utxo_byte(Cardano.BigNum.from_str(coinsPerUtxoWord))
    .fee_algo(
        Cardano.LinearFee.new(
            Cardano.BigNum.from_str(minFeeA),
            Cardano.BigNum.from_str(minFeeB)
        )
    )
    .key_deposit(Cardano.BigNum.from_str(keyDeposit))
    .pool_deposit(Cardano.BigNum.from_str(poolDeposit))
    .max_tx_size(maxTxSize)
    .max_value_size(maxValueSize)
    .ex_unit_prices(Cardano.ExUnitPrices.from_float(0, 0))
    .collateral_percentage(collateralPercentage)
    .max_collateral_inputs(maxCollateralInput)
    .build()

    const txBuilder = Cardano.TransactionBuilder.new(txBuilderConfig)
    txBuilder.add_output(transactionOutputs.get(0))

    txBuilder.set_ttl(Cardano.BigNum.from_str((slot + (3600 * 6).toString())))

    const utxos = await getUtxos(fromAddress, network)

    const utxosCore = Cardano.TransactionUnspentOutputs.new()
    utxos.forEach((utxo) => utxosCore.add(utxo))

    txBuilder.add_inputs_from(
        utxosCore,
        Cardano.Address.from_bech32(fromAddress)
    )

    txBuilder.balance(Cardano.Address.from_bech32(fromAddress))

    const transaction = await txBuilder.construct()

    // Sign Tx
    const txWitnessSet = Cardano.TransactionWitnessSet.new()
    const vKeyWitnesses = Cardano.Vkeywitnesses.new()
    const txHash = Cardano.hash_transaction(transaction.body())

    const vKey = Cardano.make_vkey_witness(txHash, paymentKey)
    vKeyWitnesses.add(vKey)
    txWitnessSet.set_vkeys(vKeyWitnesses)

    // Submmit Tx
    const txToSubmmit = Cardano.Transaction.new(transaction.body(), txWitnessSet, transaction.auxiliary_data())

    const txHex = Buffer.from(String(txToSubmmit.to_bytes()), 'hex').toString('hex')

    const result: any = await blockfrostRequest(`tx/submit`, network || 'mainnet', { 'Content-Type': 'application/cbor' }, Buffer.from(txHex, 'hex'))

    if(result.error) {
        throw ERRORS.invalid_api_request
    }

    return result
}

const CardanoWallet: AnyObject = {
    [CREATE_WALLET]: createWallet,
    [IMPORT_WALLET]: importWallet,
    [GET_BALANCES]: getBalances,
    [GET_BALANCE]: getBalance,
    [SEND_COIN]: sendAda
}

export default CardanoWallet