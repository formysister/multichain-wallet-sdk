import Hethers from '@hethers/wallet'
import Hedera from '@hashgraph/sdk'
import * as bip39 from 'bip39'
import axios from 'axios'
import { CREATE_WALLET, GET_HEDERA_ACCOUNTID_ENDPOINT } from '../../utils/constant'
import { AnyObject } from '../../utils/globalType'
import { response } from '../../utils/response'

const createWallet1 = async ( _isTestnet?: boolean ) => {

    const isTestnet = _isTestnet || false
    const client = isTestnet ? Hedera.Client.forTestnet() : Hedera.Client.forMainnet()
    const mnemonic = await Hedera.Mnemonic.generate12()
    const newAccountPrivateKey = await Hedera.PrivateKey.fromMnemonic(mnemonic)
    const newAccountPublicKey = newAccountPrivateKey.publicKey
    const transaction = await new Hedera.AccountCreateTransaction().setKey(newAccountPublicKey).setInitialBalance(new Hedera.Hbar(1000));

    const txResponse = await transaction.execute(client)

    const receipt = await txResponse.getReceipt(client)

    const newAccountId = receipt.accountId;
    // const getReceipt = await newAccount.getReceipt(client)
    // const newAccountId = getReceipt.accountId
    // const accountId = new AccountId(0)
    // const wallet = new Wallet(accountId, newAccountPrivateKey)
    // const id = wallet.accountId
    // const accountId = await axios.get(`${GET_HEDERA_ACCOUNTID_ENDPOINT}${newAccountPublicKey}`)
    return response({
        newAccountId
    })
}

const createWallet = async (_isTestnet?: boolean) => {
    const isTestnet = _isTestnet || false
    const wallet = Hethers.Wallet.createRandom()

    return response({
        mnemonic: wallet.mnemonic.phrase,
        alias: (await wallet.getAlias())
    })
}

const HederaWallet: AnyObject = {
    [CREATE_WALLET]: createWallet
}

export default HederaWallet;