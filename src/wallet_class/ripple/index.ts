import xrpl from "xrpl"
import bip39 from "bip39"

import { RIPPLE_NETWORK_RPC_URL_2 } from "../../constant"
import { Wallet } from '../../type/type'


class XrpWallet {
    client: xrpl.Client

    privateKey: string
    seed: string
    address: string

    constructor(serverUrl?: string, secret?: string) {
        if (secret) {
            const account = this.importAccount(secret)

            this.privateKey = account.privateKey
            this.address = account.address
            this.seed = account.seed || ""
        }
        else {
            const randomWallet = this.createWallet()

            this.privateKey = randomWallet.privateKey
            this.address = randomWallet.address
            this.seed = randomWallet.seed || ""
        }

        this.client = new xrpl.Client(serverUrl || RIPPLE_NETWORK_RPC_URL_2)
    }

    initialize = async (): Promise<void> => {
        try {
            await this.client.connect()
        }
        catch (error) {
            throw error
        }
    }

    /**
     * 
     * @returns {Wallet}
     */
    createWallet = (): Wallet => {
        const mnemonic = bip39.generateMnemonic()
        const wallet = xrpl.Wallet.fromMnemonic(mnemonic)

        return {
            mnemonic,
            privateKey: wallet.privateKey,
            seed: wallet.seed,
            address: wallet.address
        }
    }

    /**
     * 
     * @param mnemonic 
     * @returns {Wallet}
     */
    recoverWallet = (mnemonic: string): Wallet => {
        const wallet = xrpl.Wallet.fromMnemonic(mnemonic)

        return {
            mnemonic,
            privateKey: wallet.privateKey,
            seed: wallet.seed,
            address: wallet.address
        }
    }

    /**
     * 
     * @returns {Wallet}
     */
    createAccount = (): Wallet => {
        const mnemonic = bip39.generateMnemonic()
        const wallet = xrpl.Wallet.fromMnemonic(mnemonic)

        return {
            privateKey: wallet.privateKey,
            seed: wallet.seed,
            address: wallet.address
        }
    }

    /**
     * 
     * @param secret 
     * @returns {Wallet}
     */
    importAccount = (secret: string): Wallet => {
        const account = xrpl.Wallet.fromSeed(secret)

        return {
            privateKey: account.privateKey,
            address: account.address,
            seed: account.seed
        }
    }

    /**
     * 
     * @param address 
     * @returns {Promise<Array<{value: string, currency: string, issuer?: string | undefined}>>}
     */
    getBalances = async (address?: string): Promise<Array<{ value: string, currency: string, issuer?: string | undefined }>> => {
        try {
            if (!this.client.isConnected()) {
                await this.client.connect()
            }

            const balances = await this.client.getBalances(address || this.address)

            return balances
        }
        catch (error) {
            throw error
        }
    }


    /**
     * 
     * @param address 
     * @returns {Promise<string>}
     */
    getBalance = async (address?: string): Promise<string> => {
        try {
            if (!this.client.isConnected()) {
                await this.client.connect()
            }

            const balances = await this.client.getBalances(address || this.address)
            const balance = balances.filter((item: { currency: string, value: string }) => item.currency === 'XRP')[0].value

            await this.client.disconnect()

            return balance
        }
        catch (error) {
            throw error
        }
    }

    /**
     * 
     * @param recipientAddress 
     * @param amount 
     * @param secret 
     * @returns {Promise<string | xrpl.TransactionMetadata | undefined>}
     */
    sendXrp = async (recipientAddress: string, amount: number | string, secret?: string): Promise<string | xrpl.TransactionMetadata | undefined> => {
        try {
            if (!this.client.isConnected()) {
                await this.client.connect()
            }

            const wallet = xrpl.Wallet.fromSeed(secret || this.seed)

            const prepared = await this.client.autofill({
                TransactionType: "Payment",
                Account: wallet.address,
                Amount: xrpl.xrpToDrops(amount),
                Destination: recipientAddress
            })

            const signed = wallet.sign(prepared)

            const tx = await this.client.submitAndWait(signed.tx_blob)

            return tx.result.meta
        }
        catch (error) {
            throw error
        }
    }

    // transferToken = async (currency: string, recipientAddress: string, amount: number | string, secret?: string) => {
    //     try {
    //         if (!this.client.isConnected()) {
    //             await this.client.connect()
    //         }

    //         const wallet = xrpl.Wallet.fromSeed(secret || this.seed)

    //         const payment = {
    //             source: {
    //                 address: wallet.address,
    //                 maxAmount: {
    //                     value: amount,
    //                     currency
    //                 }
    //             },
    //             destination: {
    //                 address: recipientAddress,
    //                 amount: {
    //                     value: amount,
    //                     currency: currency
    //                 }
    //             }
    //         }

    //         const prepared = await this.client.prepareTransaction()
    //     }
    //     catch (error) {
    //         throw error
    //     }
    // }
}

export default XrpWallet