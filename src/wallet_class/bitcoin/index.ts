import bip39 from 'bip39'
import bip32 from 'bip32'
import bitcoin from 'bitcoinjs-lib'
import { PrivateKey } from 'bitcore-lib';

import { BtcNetwork, BtcWallet, BtcAccount } from "../../type/type"
import { BITCOIN_DEFAULT, BTC_MAINNET, BTC_REGTEST, BTC_TESTNET } from "../../constant";

class BitCoinWallet {

    privateKey: string
    address: string

    constructor(privateKey?: string, network?: BtcNetwork) {
        if(privateKey) {
            const _tempWallet = this.importAccount(privateKey, network || BTC_MAINNET)
            
            this.privateKey = _tempWallet.privateKey
            this.address = _tempWallet.address
        }
        else {
            const _tempWallet = this.createWallet(network || BTC_MAINNET)
            
            this.privateKey = _tempWallet.privateKey
            this.address = _tempWallet.address
        }
    }

    /**
     * 
     * @param network 
     * @param derivedPath 
     * @returns {BtcWallet}
     */
    createWallet = (network?: BtcNetwork, derivedPath?: string): BtcWallet => {
        let btcNetwork;

        const currentNetwork = network || BTC_MAINNET

        switch(currentNetwork) {
            case BTC_MAINNET:
                btcNetwork = bitcoin.networks.bitcoin;
                break;
            case BTC_REGTEST:
                btcNetwork = bitcoin.networks.regtest;
                break;
            case BTC_TESTNET:
                btcNetwork = bitcoin.networks.testnet;
                break;
            default:
                btcNetwork = bitcoin.networks.bitcoin;
                break;
        }
    
        const path = derivedPath || BITCOIN_DEFAULT;
    
        const mnemonic = bip39.generateMnemonic();
        const seed = bip39.mnemonicToSeedSync(mnemonic);
    
        const root = bip32.fromSeed(seed, btcNetwork);
    
        const account = root.derivePath(path);
        const node = account.derive(0);
    
        const address = bitcoin.payments.p2pkh({
            pubkey: node.publicKey,
            network: btcNetwork
        }).address || '';
    
        return {
            address: address,
            privateKey: node.toWIF(),
            mnemonic: mnemonic
        }
    }

    /**
     * 
     * @param mnemonic 
     * @param network 
     * @param derivedPath 
     * @returns {BtcWallet}
     */
    recoverWallet = (mnemonic: string, network: string, derivedPath?: string): BtcWallet => {
        let btcNetwork;
    
        switch(network) {
            case BTC_MAINNET:
                btcNetwork = bitcoin.networks.bitcoin;
                break;
            case BTC_REGTEST:
                btcNetwork = bitcoin.networks.regtest;
                break;
            case BTC_TESTNET:
                btcNetwork = bitcoin.networks.testnet;
                break;
            default:
                btcNetwork = bitcoin.networks.bitcoin;
                break;
        }
    
        const path = derivedPath || BITCOIN_DEFAULT;
    
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        // const bip32 = BIP32Factory(ecc);
        const root = bip32.fromSeed(seed, btcNetwork);
    
        const account = root.derivePath(path);
        const node = account.derive(0);
    
        const address = bitcoin.payments.p2pkh({
            pubkey: node.publicKey,
            network: btcNetwork
        }).address || '';
    
        return {
            address: address,
            privateKey: node.toWIF(),
            mnemonic: mnemonic
        }
    }

    /**
     * 
     * @param network 
     * @param privateKey 
     * @returns {BtcAccount}
     */
    importAccount = (privateKey: string, network?: BtcNetwork): BtcAccount => {
        let btcNetwork;
        
        const currentNetwork = network || BTC_MAINNET

        switch(currentNetwork) {
            case BTC_MAINNET:
                btcNetwork = bitcoin.networks.bitcoin;
                break;
            case BTC_REGTEST:
                btcNetwork = bitcoin.networks.regtest;
                break;
            case BTC_TESTNET:
                btcNetwork = bitcoin.networks.testnet;
                break;
            default:
                btcNetwork = bitcoin.networks.bitcoin;
                break;
        }
    
        const privateKeyObj = new PrivateKey(privateKey);
    
        const publicKey = privateKeyObj.publicKey.toBuffer();
    
        const address = bitcoin.payments.p2pkh({
            pubkey: publicKey,
            network: btcNetwork
        }).address || '';
    
        return {
            address: address,
            privateKey: privateKey,
        }
    }
}

export default BitCoinWallet