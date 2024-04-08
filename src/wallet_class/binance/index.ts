import {
    generateMnemonic,
    getPrivateKeyFromMnemonic,
    getPublicKeyFromPrivateKey,
    getAddressFromPublicKey
} from "@binance-chain/javascript-sdk/lib/crypto";

import { BncClient } from "@binance-chain/javascript-sdk/lib/client";

import { Wallet } from "../../type/type";

class BinanceWallet {

    privateKey: string
    address: string

    constructor() {
        const mnemonic = generateMnemonic();
        const privateKey = getPrivateKeyFromMnemonic(mnemonic);
        const publicKey = getPublicKeyFromPrivateKey(privateKey);
        const address = getAddressFromPublicKey(publicKey, 'bnb');

        this.privateKey = privateKey
        this.address = address
    }

    /**
     * 
     * @returns {Wallet}
     */
    createWallet = (): Wallet => {
        const mnemonic = generateMnemonic();
        const privateKey = getPrivateKeyFromMnemonic(mnemonic);
        const publicKey = getPublicKeyFromPrivateKey(privateKey);
        const address = getAddressFromPublicKey(publicKey, 'bnb');

        return {
            mnemonic,
            privateKey,
            address
        }
    }

    /**
     * 
     * @param mnemonic 
     * @returns {Wallet}
     */
    recoverWallet = (mnemonic: string): Wallet => {
        const privateKey = getPrivateKeyFromMnemonic(mnemonic);
        const publicKey = getPublicKeyFromPrivateKey(privateKey);
        const address = getAddressFromPublicKey(publicKey, 'bnb');

        return {
            mnemonic,
            privateKey,
            address
        }
    }

    /**
     * 
     * @param privateKey 
     * @returns {Wallet}
     */
    importAccount = (privateKey: string): Wallet => {
        const publicKey = getPublicKeyFromPrivateKey(privateKey);
        const address = getAddressFromPublicKey(publicKey, 'bnb');

        return {
            privateKey,
            address
        }
    }

    /**
     * 
     * @param rpcUrl 
     * @param network 
     * @param address 
     * @returns {Promise<any>}
     */
    getBalance = async (rpcUrl: string, network: 'mainnet' | 'testnet', address?: string): Promise<any> => {
        try {
            const client = new BncClient(rpcUrl)
            client.chooseNetwork(network)

            const balance = await client.getBalance(address || this.address)

            if(balance.length <= 0 || balance == null || balance == undefined || !balance.filter((asset: any) => asset.symbol === 'BNB')) {
                return 0
            } else {
                return balance.filter((asset: any) => {return asset.symbol === 'BNB'})[0].free
            }
        }
        catch(error) {
            throw error
        }
    }

    /**
     * 
     * @param rpcUrl 
     * @param fromAddress 
     * @param recipientAddress 
     * @param amount 
     * @param network 
     * @param privateKey 
     * @returns {Promise<{result: any, status: number}>}
     */
    sendBNB = async (rpcUrl: string, fromAddress: string, recipientAddress: string, amount: any, network: 'mainnet' | 'testnet', privateKey?: string): Promise<{result: any, status: number}> => {
        const client = new BncClient(rpcUrl)
        client.chooseNetwork(network)
        client.setPrivateKey(privateKey || this.privateKey)
    
        const tx = await client.transfer(fromAddress, recipientAddress, amount, 'BNB')
        return tx
    }

    /**
     * 
     * @param rpcUrl 
     * @param fromAddress 
     * @param recipientAddress 
     * @param amount 
     * @param network 
     * @param asset 
     * @param privateKey 
     * @returns {Promise<{result: any, status: number}>}
     */
    tokenTransfer = async (rpcUrl: string, fromAddress: string, recipientAddress: string, amount: any, network: 'mainnet' | 'testnet', asset: string, privateKey?: string): Promise<{result: any, status: number}> => {
        const client = new BncClient(rpcUrl);
        client.chooseNetwork(network);
        client.setPrivateKey(privateKey || this.privateKey);
    
        const tx = await client.transfer(fromAddress, recipientAddress, amount, asset);
        return tx
    }
}

export default BinanceWallet