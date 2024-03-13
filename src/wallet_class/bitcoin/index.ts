import * as bip39 from 'bip39'
import * as bip32 from 'bip32'
import * as bitcoin from 'bitcoinjs-lib'
import { PrivateKey } from 'bitcore-lib';

import axios, { AxiosResponse } from 'axios';

import { fetchUTXOs } from '../../helper/bitcoinHelper';

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
        if (privateKey) {
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

        switch (currentNetwork) {
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
            pubkey: node.publicKey,
            network: btcNetwork
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

        switch (currentNetwork) {
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
            pubkey: node.publicKey,
            network: btcNetwork
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

        switch (currentNetwork) {
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
            pubkey: publicKeyBuffer,
            network: btcNetwork
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
    getBalance = async (address: string, network?: BtcNetwork): Promise<number> => {
        try {
            let response: AxiosResponse

            switch (network) {
                case "bitcoin":
                    response = await axios.get(`https://blockchain.info/q/addressbalance/${address}/`)
                    break;
                case "testnet":
                    response = await axios.get(`https://blockstream.info/testnet/api/address/${address}/utxo`)
                    break;
                case "regtest":
                    response = await axios.get(`https://blockstream.info/testnet/api/address/${address}/utxo`)
                    break;
                default:
                    response = await axios.get(`https://blockchain.info/q/addressbalance/${address}/`)
                    break;
            }

            return response.data
        } catch (error) {
            throw error
        }
    }

    /**
     * 
     * @param receiverAddress 
     * @param amount 
     * @returns {any}
     */
    sendBitcoin = async (recipientAddress: string, amount: number, network?: BtcNetwork): Promise<any> => {
        try {
            let btcNetwork;

            const currentNetwork = network || BTC_MAINNET

            switch (currentNetwork) {
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

            const response = await axios.get(`https://blockchain.info/unspent?active=${this.address.bech32}`)
            const utxos = response.data.unspent_outputs

            const tx = new bitcoin.Transaction()

            if(utxos.length === 0) {
                tx.addInput(Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex'), 0)
            }
            else {
                tx.addInput(Buffer.from(utxos[utxos.length - 1]['tx_hash'], 'hex'), 0)
            }

            tx.addOutput(Buffer.from(recipientAddress), amount)

            const txHex = tx.toHex()

            return utxos
        }
        catch (error) {
            throw error
        }
    }
}

export default BitCoinWallet