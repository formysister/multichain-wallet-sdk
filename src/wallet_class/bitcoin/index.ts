import * as bip39 from 'bip39'
import * as bip32 from 'bip32'
import * as bitcoin from 'bitcoinjs-lib'
import { PrivateKey } from 'bitcore-lib';

import axios from 'axios';

import { BtcNetwork, BtcWallet, BtcAccount } from "../../type/type"
import { BITCOIN_DEFAULT, BTC_MAINNET, BTC_REGTEST, BTC_TESTNET } from "../../constant";

class BitCoinWallet {

    privateKey: string
    address: { p2pkh: string, bech32: string }

    /**
     * 
     * @param privateKey 
     * @param network 
     */
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
    
        const publicKeyP2pkh = bitcoin.payments.p2pkh({
            pubkey: node.publicKey,
            network: btcNetwork
        }).address || '';

        const publicKeyBech32 = bitcoin.payments.p2wpkh({
            pubkey: node.publicKey
        }).address || ''

        return {
            address: {
                p2pkh: publicKeyP2pkh,
                bech32: publicKeyBech32
            },
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
    recoverWallet = (mnemonic: string, network?: BtcNetwork, derivedPath?: string): BtcWallet => {
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
    
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        // const bip32 = BIP32Factory(ecc);
        const root = bip32.fromSeed(seed, btcNetwork);
    
        const account = root.derivePath(path);
        const node = account.derive(0);
    
        const publicKeyP2pkh = bitcoin.payments.p2pkh({
            pubkey: node.publicKey,
            network: btcNetwork
        }).address || '';
    
        const publicKeyBech32 = bitcoin.payments.p2wpkh({
            pubkey: node.publicKey
        }).address || ''

        return {
            address: {
                p2pkh: publicKeyP2pkh,
                bech32: publicKeyBech32
            },
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
    
        const publicKeyBuffer = privateKeyObj.publicKey.toBuffer();
    
        const publicKeyP2Pkh = bitcoin.payments.p2pkh({
            pubkey: publicKeyBuffer,
            network: btcNetwork
        }).address || '';
    
        const publicKeyBech32 = bitcoin.payments.p2wpkh({
            pubkey: publicKeyBuffer
        }).address || ''

        return {
            address: {
                p2pkh: publicKeyP2Pkh,
                bech32: publicKeyBech32
            },
            privateKey: privateKey,
        }
    }

    /**
     * 
     * @param address 
     * @returns {Number}
     */
    getBalance = async (address: string): Promise<number> => {
        try {
            const response = await axios.get(`https://blockchain.info/q/addressbalance/${address}/`)

            return response.data
        } catch (error) {
            throw error
        }
    }

    /**
     * 
     */
    setBitcoin = async (receiverAddress: string, amount: number) => {
        try {
            const response = await axios.get(`https://blockchain.info/unspent?active=${this.address.bech32}`)
            const utxos = response.data.unspent_outputs

            return utxos
        }
        catch(error) {

        }
    }
}

export default BitCoinWallet