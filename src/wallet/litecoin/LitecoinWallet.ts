// import * as ecc from 'tiny-secp256k1';
import * as  bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from 'bip32';
// import BIP32Factory from 'bip32';
import litecore from 'litecore-lib'


import { CREATE_WALLET, IMPORT_WALLET, LITECOIN_DEFAULT, LITECOIN_NETWORK_PROTOTYPE } from "../../utils/constant";
import { AnyObject } from "../../utils/globalType";
import { response, walletResponse } from '../../utils/response';

const createWallet = () => {
    const path = LITECOIN_DEFAULT;

    const mnemonic = bip39.generateMnemonic();

    const seed = bip39.mnemonicToSeedSync(mnemonic);
    // const bip32 = BIP32Factory(ecc);
    const root = bip32.fromSeed(seed, LITECOIN_NETWORK_PROTOTYPE);

    const account = root.derivePath(path);
    const node = account.derive(0);

    // const privateKey = new litecore.PrivateKey()
    // const address = privateKey.toAddress()

    const address = bitcoin.payments.p2pkh({
        pubkey: node.publicKey,
        network: LITECOIN_NETWORK_PROTOTYPE
    }).address;

    return walletResponse({
        privateKey: node.toWIF(),
        address: address,
        mnemonic: mnemonic
    })
}

const importWallet = (mnemonic: string) => {
    const path = LITECOIN_DEFAULT;

    const seed = bip39.mnemonicToSeedSync(mnemonic);
    // const bip32 = BIP32Factory(ecc);
    const root = bip32.fromSeed(seed, LITECOIN_NETWORK_PROTOTYPE);

    const account = root.derivePath(path);
    const node = account.derive(0);

    const address = bitcoin.payments.p2pkh({
        pubkey: node.publicKey,
        network: LITECOIN_NETWORK_PROTOTYPE
    }).address;
    
    return walletResponse({
        address: address,
        privateKey: node.toWIF(),
        mnemonic: mnemonic
    })
}

const LitecoinWallet: AnyObject = {
    [CREATE_WALLET]: createWallet,
    [IMPORT_WALLET]: importWallet
}

export default LitecoinWallet;