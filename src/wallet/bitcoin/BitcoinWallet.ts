// import BIP32Factory from 'bip32';
import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib';
import { PrivateKey } from 'bitcore-lib';

import axios from 'axios';
import { fetchUTXOs } from '../../helper/bitcoinHelper';

import { response, walletResponse, balanceResponse } from '../../utils/response';
import { 
    BITCOIN_DEFAULT,
    BTC_MAINNET,
    BTC_REGTEST,
    BTC_TESTNET,
    GET_BALANCE
} from '../../utils/constant';
import { 
    CREATE_WALLET,
    IMPORT_WALLET,
    IMPORT_ACCOUNT,
    SEND_COIN
} from '../../utils/constant';
import { AnyObject } from '../../utils/globalType';

const createWallet = (_network: string, derivedPath?: string) => {

    let network;

    switch(_network) {
        case BTC_MAINNET:
            network = bitcoin.networks.bitcoin;
            break;
        case BTC_REGTEST:
            network = bitcoin.networks.regtest;
            break;
        case BTC_TESTNET:
            network = bitcoin.networks.testnet;
            break;
        default:
            network = bitcoin.networks.bitcoin;
            break;
    }

    const path = derivedPath || BITCOIN_DEFAULT;

    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    const root = bip32.fromSeed(seed, network);

    const account = root.derivePath(path);
    const node = account.derive(0);

    const address = bitcoin.payments.p2pkh({
        pubkey: node.publicKey,
        network: network
    }).address;

    return walletResponse({
        address: address,
        privateKey: node.toWIF(),
        mnemonic: mnemonic
    })
}

const importWallet = async (_network: string, mnemonic: string, derivedPath?: string) => {
    let network;

    switch(_network) {
        case BTC_MAINNET:
            network = bitcoin.networks.bitcoin;
            break;
        case BTC_REGTEST:
            network = bitcoin.networks.regtest;
            break;
        case BTC_TESTNET:
            network = bitcoin.networks.testnet;
            break;
        default:
            network = bitcoin.networks.bitcoin;
            break;
    }

    const path = derivedPath || BITCOIN_DEFAULT;

    const seed = bip39.mnemonicToSeedSync(mnemonic);
    // const bip32 = BIP32Factory(ecc);
    const root = bip32.fromSeed(seed, network);

    const account = root.derivePath(path);
    const node = account.derive(0);

    const address = bitcoin.payments.p2pkh({
        pubkey: node.publicKey,
        network: network
    }).address;

    return walletResponse({
        address: address,
        privateKey: node.toWIF(),
        mnemonic: mnemonic
    })
}

const importAccount = async (_network: string, _privateKey: string) => {
    let network;

    switch(_network) {
        case BTC_MAINNET:
            network = bitcoin.networks.bitcoin;
            break;
        case BTC_REGTEST:
            network = bitcoin.networks.regtest;
            break;
        case BTC_TESTNET:
            network = bitcoin.networks.testnet;
            break;
        default:
            network = bitcoin.networks.bitcoin;
            break;
    }

    const privateKey = new PrivateKey(_privateKey);

    const publicKey = privateKey.publicKey.toBuffer();

    const address = bitcoin.payments.p2pkh({
        pubkey: publicKey,
        network: network
    }).address;

    return walletResponse({
        address: address,
        privateKey: _privateKey,
    })
}

const getBalance = async (address: string) => {
    let balance;
    try {
        // balance  = await axios.get(`https://blockchain.info/q/addressbalance/${address}`);
        balance = await axios.get(`https://blockstream.info/api/address/${address}/utxo`)
    } catch (err: any) {
        return new Error(err);
    }
    
    return balanceResponse( balance.data )
}

const sendBtc = async (_network: string, senderPrivateKey: string, senderAddress: string, receiveAddress: string, amount: number, gasFee?: number) => {
    let network

    switch(_network) {
        case BTC_MAINNET:
            network = bitcoin.networks.bitcoin;
            break;
        case BTC_REGTEST:
            network = bitcoin.networks.regtest;
            break;
        case BTC_TESTNET:
            network = bitcoin.networks.testnet;
            break;
        default:
            network = bitcoin.networks.bitcoin;
            break;
    }

    const utxos = await fetchUTXOs(_network, senderAddress)

    return response({
        provateKey: senderPrivateKey,
        network: _network,
        from: senderAddress,
        to: receiveAddress,
        amount: amount,
        fee: gasFee,
        utxos: utxos
    })
}

const BitcoinWallet: AnyObject = {
    [CREATE_WALLET]: createWallet,
    [IMPORT_WALLET]: importWallet,
    [IMPORT_ACCOUNT]: importAccount,
    [GET_BALANCE]: getBalance,
    [SEND_COIN]: sendBtc
}

export default BitcoinWallet;