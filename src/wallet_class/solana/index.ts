import * as solanaWeb3 from "@solana/web3.js"
import {
    getOrCreateAssociatedTokenAccount,
    transfer as transferToken,
    getMint
} from "@solana/spl-token"
import * as bs58 from 'bs58'
import * as bip39 from 'bip39'
import { derivePath } from "ed25519-hd-key"
import axios from 'axios';

// @ts-ignore
import * as BufferLayout from 'buffer-layout'

import { SOLANA_DEFAULT, SOLANA_TOKENLIST_URI } from "../../constant"
import { ISplTokenInfo, ITokenInfo } from '../../type/interface'
import { Wallet } from '../../type/type'

class SolanaWallet {
    readonly chainId = {
        'mainnet-beta': 101,
        testnet: 102,
        devnet: 103,
    }

    readonly ACCOUNT_LAYOUT = BufferLayout.struct([
        BufferLayout.blob(32, 'mint'),
        BufferLayout.blob(32, 'owner'),
        BufferLayout.nu64('amount'),
        BufferLayout.blob(93)
    ])

    // Network data
    rpcUrl: string
    provider: solanaWeb3.Connection

    // Wallet main data
    privateKey: string = ""
    address: string = ""

    constructor(rpcUrl: string) {
        this.rpcUrl = rpcUrl
        this.provider = this.getProvider(rpcUrl)
    }

    /**
     * 
     * @param privateKey 
     */
    initialize = async (privateKey?: string) => {
        try {
            if (privateKey) {
                const account = await this.importAccount(privateKey)

                this.privateKey = account.privateKey
                this.address = account.address
            }
            else {
                const account = await this.createAccount()

                this.privateKey = account.privateKey
                this.address = account.address
            }
        }
        catch(error) {
            throw error
        }
    }

    /**
     * 
     * @param derivedPath
     * @returns {Promise<Wallet>}
     */
    createWallet = async (derivedPath?: string): Promise<Wallet> => {
        try {
            const path = derivedPath || SOLANA_DEFAULT
            const mnemonic = bip39.generateMnemonic()
            const seed = await bip39.mnemonicToSeed(mnemonic)
            const derivedSeed = derivePath(path, (seed as unknown) as string).key
            const keyPair = solanaWeb3.Keypair.fromSeed(derivedSeed)

            return {
                address: keyPair.publicKey.toBase58(),
                privateKey: bs58.encode(keyPair.secretKey),
                mnemonic
            }
        }
        catch (error) {
            throw error
        }
    }

    /**
     * 
     * @param mnemonic 
     * @param derivedPath 
     * @returns {Promise<Wallet>}
     */
    recoverWallet = async (mnemonic: string, derivedPath?: string): Promise<Wallet> => {
        try {
            const path = derivedPath || SOLANA_DEFAULT;
            const seed = await bip39.mnemonicToSeed(mnemonic);
            const derivedSeed = derivePath(path, (seed as unknown) as string).key;
            const keyPair = solanaWeb3.Keypair.fromSeed(derivedSeed);

            return {
                address: keyPair.publicKey.toBase58(),
                privateKey: bs58.encode(keyPair.secretKey),
                mnemonic
            }
        }
        catch (error) {
            throw error
        }
    }

    /**
     * 
     * @param privateKey 
     * @returns {solanaWeb3.Keypair}
     */
    getKeyPairFromPrivateKey = (privateKey: string): solanaWeb3.Keypair => {
        const secretKey = bs58.decode(privateKey);
        const keyPair = solanaWeb3.Keypair.fromSecretKey(secretKey, { skipValidation: true });

        return keyPair;
    }

    /**
     * 
     * @param derivedPath 
     * @returns {Promise<Wallet>}
     */
    createAccount = async (derivedPath?: string): Promise<Wallet> => {
        try {
            const path = derivedPath || SOLANA_DEFAULT
            const mnemonic = bip39.generateMnemonic()
            const seed = await bip39.mnemonicToSeed(mnemonic)
            const derivedSeed = derivePath(path, (seed as unknown) as string).key
            const keyPair = solanaWeb3.Keypair.fromSeed(derivedSeed)

            return {
                address: keyPair.publicKey.toBase58(),
                privateKey: bs58.encode(keyPair.secretKey)
            }
        }
        catch (error) {
            throw error
        }
    }

    /**
     * 
     * @param privateKey 
     * @returns {Promise<Wallet>}
     */
    importAccount = async (privateKey: string): Promise<Wallet> => {
        try {
            const secretKey = bs58.decode(privateKey);
            const keyPair = solanaWeb3.Keypair.fromSecretKey(secretKey, { skipValidation: true });

            return {
                address: keyPair.publicKey.toBase58(),
                privateKey: privateKey
            }
        }
        catch (error) {
            throw error
        }
    }

    /**
     * 
     * @param address 
     * @param tokenAddress 
     * @returns {Promise<number>}
     */
    getBalance = async (address: string, tokenAddress?: string): Promise<number> => {
        try {
            let balance: number
            if (tokenAddress) {
                const account = await this.provider.getTokenAccountsByOwner(
                    new solanaWeb3.PublicKey(address),
                    {
                        mint: new solanaWeb3.PublicKey(tokenAddress)
                    }
                );
    
                balance = account.value.length > 0 ? this.ACCOUNT_LAYOUT.decode(account.value[0].account.data).amount : 0
                return balance
            }
            const publicKey = new solanaWeb3.PublicKey(address)
            balance = await this.provider.getBalance(publicKey)
            
            return balance
        } catch (error) {
            throw error
        }
    }

    /**
     * 
     * @param to 
     * @param amount 
     * @param privateKey 
     * @returns {Promise<solanaWeb3.TransactionResponse | null>}
     */
    sendSol = async (to: string, amount: number, privateKey?: string): Promise<solanaWeb3.TransactionResponse | null> => {
        try {
            const keyPair = this.getKeyPairFromPrivateKey(privateKey || this.privateKey);

            const fromPub = new solanaWeb3.PublicKey(keyPair.publicKey.toBase58());
            const toPub = new solanaWeb3.PublicKey(to);

            const transaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: fromPub,
                    toPubkey: toPub,
                    lamports: solanaWeb3.LAMPORTS_PER_SOL * amount
                })
            )

            const signature = await solanaWeb3.sendAndConfirmTransaction(
                this.provider,
                transaction,
                [keyPair]
            )

            const tx = await this.provider.getTransaction(signature);

            return tx
        }
        catch (error) {
            throw error
        }
    }

    /**
     * 
     * @param tokenAddress 
     * @param to 
     * @param amount 
     * @param privateKey 
     * @returns {Promise<solanaWeb3.TransactionResponse | null>}
     */
    transferToken = async (tokenAddress: string, to: string, amount: number, privateKey?: string): Promise<solanaWeb3.TransactionResponse | null> => {
        try {
            const recipient = new solanaWeb3.PublicKey(to);
            let secretKey: Uint8Array
            let signature: solanaWeb3.TransactionSignature
    
            if ((privateKey || this.privateKey).split(',').length > 1) {
                secretKey = new Uint8Array((privateKey || this.privateKey).split(',') as any);
            } else {
                secretKey = bs58.decode(privateKey || this.privateKey);
            }
    
            const from = solanaWeb3.Keypair.fromSecretKey(secretKey, {
                skipValidation: true,
            })
    
            if (tokenAddress) {
                // Get token mint
                const mint = await getMint(
                    this.provider,
                    new solanaWeb3.PublicKey(tokenAddress)
                )
    
                // Get the token account of the from address, and if it does not exist, create it
                const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                    this.provider,
                    from,
                    mint.address,
                    from.publicKey
                )
    
                // Get the token account of the recipient address, and if it does not exist, create it
                const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
                    this.provider,
                    from,
                    mint.address,
                    recipient
                )
    
                signature = await transferToken(
                    this.provider,
                    from,
                    fromTokenAccount.address,
                    recipientTokenAccount.address,
                    from.publicKey,
                    solanaWeb3.LAMPORTS_PER_SOL * amount
                )
            } else {
                const transaction = new solanaWeb3.Transaction().add(
                    solanaWeb3.SystemProgram.transfer({
                        fromPubkey: from.publicKey,
                        toPubkey: recipient,
                        lamports: solanaWeb3.LAMPORTS_PER_SOL * amount,
                    })
                )
    
                // Sign transaction, broadcast, and confirm
                signature = await solanaWeb3.sendAndConfirmTransaction(
                    this.provider,
                    transaction,
                    [from]
                )
            }
    
            const tx = await this.provider.getTransaction(signature)
    
            return tx
        } catch (error) {
            throw error
        }
    }

    /**
     * util function
     */

    /**
     * 
     * @param rpcUrl 
     * @returns {solanaWeb3.Connection}
     */
    getProvider = (rpcUrl: string): solanaWeb3.Connection => {
        return new solanaWeb3.Connection(rpcUrl);
    }

    /**
     * 
     * @param hash 
     * @returns {Promise<solanaWeb3.TransactionResponse | null>}
     */
    getTransaction = async (hash: string): Promise<solanaWeb3.TransactionResponse | null> => {
        try {
            const tx = await this.provider.getTransaction(hash)

            return tx
        }
        catch (error) {
            throw error
        }
    }

    /**
     * 
     * @param cluster 
     * @returns {Array<ISplTokenInfo>}
     */
    getTokenList = async (cluster: 'mainnet-beta' | 'testnet' | 'devnet'): Promise<Array<ISplTokenInfo>> => {
        try {
            const response = await axios.get(SOLANA_TOKENLIST_URI)
            if (response.data && response.data.tokens) {
                return response.data.tokens.filter(
                    (data: ISplTokenInfo) => data.chainId === this.chainId[cluster]
                )
            }
            return []
        }
        catch(error) {
            throw error
        }
    }

    /**
     * 
     * @param cluster 
     * @param address 
     * @returns {Promise<ITokenInfo | null>}
     */
    getTokenInfo = async (cluster: 'mainnet-beta' | 'testnet' | 'devnet', address: string): Promise<ITokenInfo | null> => {
        try {
            const tokenList = await this.getTokenList(cluster!);
            const token = tokenList.find(token => token.address === address);
    
            if (token) {
                const data = {
                    name: token.name,
                    symbol: token.symbol,
                    address: token.address,
                    decimals: token.decimals,
                    logoUrl: token.logoURI,
                    totalSupply: 0
                }
    
                const totalSupply = await this.provider.getTokenSupply(
                    new solanaWeb3.PublicKey(data.address)
                )

                data.totalSupply = totalSupply.value.uiAmount!
    
                return data
            }
            else {
                return null
            }
        } catch (error) {
            throw error
        }
    }
}

export default SolanaWallet