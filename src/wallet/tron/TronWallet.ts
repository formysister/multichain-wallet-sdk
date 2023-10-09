import TronWeb from 'tronweb';
import * as bip39 from "bip39";
import * as bip32 from "bip32"
// import { BIP32Factory } from "bip32";
// import * as ecc from "tiny-secp256k1";

import {
    TRON_DEFAULT,
    TRON_MAINNET,
    TRON_MAINNET_FULL_NODE,
    TRON_MAINNET_SOLIDITY_NODE,
    TRON_MAINNET_EVENT_SERVER,
    TRONGRID_API_KEY,
    TRON_SHASTA_TESTNET,
    CREATE_WALLET,
    IMPORT_WALLET,
    IMPORT_ACCOUNT,
    GET_BALANCE,
    SEND_COIN,
    GET_TOKEN
} from "../../utils/constant";
import { AnyObject } from "../../utils/globalType";
import { response, walletResponse, balanceResponse } from "../../utils/response";

const createWallet = async (nonce?: number) => {
    // const bip32 = BIP32Factory(ecc);
    const mnemonic = bip39.generateMnemonic();
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const node = await bip32.fromSeed(seed);
    const child = await node.derivePath(`m/44'/195'/${nonce || 0}'`);
    const privateKeyBuf = child.privateKey;
    const privateKeyHex = privateKeyBuf?.toString("hex");
    const privateKey = String(privateKeyHex);
    const address = TronWeb.address.fromPrivateKey(privateKey);

    return walletResponse({
        mnemonic,
        privateKey,
        address,
    });
};

const importWallet = async (mnemonic: string, nonce?: string) => {

    // const bip32 = BIP32Factory(ecc);
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const node = await bip32.fromSeed(seed);
    const child = await node.derivePath(`m/44'/195'/${nonce || 0}'`);
    const privateKeyBuf = child.privateKey;
    const privateKeyHex = privateKeyBuf?.toString("hex");
    const privateKey = String(privateKeyHex);
    const address = TronWeb.address.fromPrivateKey(privateKey);

    return walletResponse({
        mnemonic,
        privateKey,
        address,
    });
};

const importAccount = async (privateKey: string) => {

    const address = TronWeb.address.fromPrivateKey(privateKey);

    return walletResponse({
        privateKey,
        address,
    });
};

const getBalance = async (address: string) => {
    const tronWeb = new TronWeb(TRON_MAINNET_FULL_NODE, TRON_MAINNET_SOLIDITY_NODE, TRON_MAINNET_EVENT_SERVER)

    const balance = await tronWeb.trx.getBalance(address)

    return balanceResponse(balance)
};

const sendTrx = async (privateKey: string, fromAddress: string, toAddress: string, amount: number) => {
    const tronWeb = new TronWeb(TRON_MAINNET_FULL_NODE, TRON_MAINNET_SOLIDITY_NODE, TRON_MAINNET_EVENT_SERVER)
    const unsignedTx = await tronWeb.transactionBuilder.sendTrx(toAddress, amount, fromAddress)
    const signedTx = await tronWeb.trx.sign(unsignedTx, privateKey)
    const confirmed = await tronWeb.trx.sendRawTransaction(signedTx)
    
    return confirmed
}

const getTokenInfo = async(contractAddress: string) => {
    const tronWeb = new TronWeb(TRON_MAINNET_FULL_NODE, TRON_MAINNET_SOLIDITY_NODE, TRON_MAINNET_EVENT_SERVER)
    const tokenInfo = await tronWeb.trx.getTokenByID(contractAddress)

    return tokenInfo
}

const TronWallet: AnyObject = {
    [CREATE_WALLET]: createWallet,
    [IMPORT_WALLET]: importWallet,
    [IMPORT_ACCOUNT]: importAccount,
    [GET_BALANCE]: getBalance,
    [SEND_COIN]: sendTrx,
    [GET_TOKEN]: getTokenInfo
};

export default TronWallet;