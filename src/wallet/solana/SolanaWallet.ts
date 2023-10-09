import { provider } from "../../helper/solanaHelper";
import * as solanaWeb3 from "@solana/web3.js";
import {
    getOrCreateAssociatedTokenAccount,
    transfer as transferToken,
    getMint
} from "@solana/spl-token";
import * as bs58 from 'bs58';
import * as bip39 from 'bip39';
import { derivePath } from "ed25519-hd-key";
// @ts-ignore
import * as BufferLayout from 'buffer-layout';

import {
    CREATE_WALLET,
    IMPORT_WALLET,
    IMPORT_ACCOUNT,
    SEND_COIN,
    TRANSFER_TOKEN,
    GET_TOKEN,
    GET_TRANSACTION,
    GET_TOKEN_LIST,
    GET_BALANCE,
    GET_BALANCES
} from "../../utils/constant";
import {
    ISplTokenInfo,
    ITokenInfo
} from "../../utils/payloads/solana";
import { AnyObject } from "../../utils/globalType";
import { SOLANA_DEFAULT } from "../../utils/constant";
import { SOLANA_TOKENLIST_URI } from "../../utils/constant";
import { response, walletResponse, balanceResponse } from "../../utils/response";
import axios from "axios";

export const ACCOUNT_LAYOUT = BufferLayout.struct([
    BufferLayout.blob(32, 'mint'),
    BufferLayout.blob(32, 'owner'),
    BufferLayout.nu64('amount'),
    BufferLayout.blob(93)
])

export const chainId = {
    'mainnet-beta': 101,
    testnet: 102,
    devnet: 103,
};

const getConnection = (rpcUrl: string) => {
    const connection = provider(rpcUrl);
    return connection;
}

const getBalance = async (rpcUrl: string, address: string, tokenAddress?: string) => {
    const connection = getConnection(rpcUrl);

    try {
        let balance;
        if (tokenAddress) {
            const account = await connection.getTokenAccountsByOwner(
                new solanaWeb3.PublicKey(address),
                {
                    mint: new solanaWeb3.PublicKey(tokenAddress)
                }
            );

            balance = account.value.length > 0 ? ACCOUNT_LAYOUT.decode(account.value[0].account.data).amount : 0;
            return balanceResponse( balance );
        }
        const publicKey = new solanaWeb3.PublicKey(address);
        balance = await connection.getBalance(publicKey);
        
        return balanceResponse( balance );
    } catch (err) {
        throw err;
    }
}

const createWallet = async (derivedPath?: string) => {
    const path = derivedPath || SOLANA_DEFAULT;

    const mnemonic = bip39.generateMnemonic();
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const derivedSeed = derivePath(path, (seed as unknown) as string).key;

    const keyPair = solanaWeb3.Keypair.fromSeed(derivedSeed);

    return walletResponse({
        address: keyPair.publicKey.toBase58(),
        privateKey: bs58.encode(keyPair.secretKey),
        mnemonic
    })
}

const importWallet = async (mnemonic: string, derivedPath: string) => {
    const path = derivedPath || SOLANA_DEFAULT;
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const derivedSeed = derivePath(path, (seed as unknown) as string).key;
    const keyPair = solanaWeb3.Keypair.fromSeed(derivedSeed);

    return walletResponse({
        address: keyPair.publicKey.toBase58(),
        privateKey: bs58.encode(keyPair.secretKey),
        mnemonic
    })
}

const getKeyPairFromPrivateKey = (privateKey: string) => {
    const secretKey = bs58.decode(privateKey);
    const keyPair = solanaWeb3.Keypair.fromSecretKey(secretKey, { skipValidation: true });

    return keyPair;
}

const importAccount = async (privateKey: string) => {
    const secretKey = bs58.decode(privateKey);
    const keyPair = solanaWeb3.Keypair.fromSecretKey(secretKey, { skipValidation: true });

    return walletResponse({
        address: keyPair.publicKey.toBase58(),
        privateKey: privateKey
    })
}

const sendSol = async (rpcUrl: string, privateKey: string, from: string, to: string, amount: number) => {

    const connection = getConnection(rpcUrl);
    const keyPair = getKeyPairFromPrivateKey(privateKey);

    const fromPub = new solanaWeb3.PublicKey(from);
    const toPub = new solanaWeb3.PublicKey(to);

    const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
            fromPubkey: fromPub,
            toPubkey: toPub,
            lamports: solanaWeb3.LAMPORTS_PER_SOL * amount
        })
    )

    const signature = await solanaWeb3.sendAndConfirmTransaction(
        connection,
        transaction,
        [keyPair]
    )

    const tx = await connection.getTransaction(signature);

    return response({
        ...tx
    })
}

const tokenTransfer = async (rpcUrl: string, privateKey: string, tokenAddress: string, to: string, amount: number) => {
    const connection = getConnection(rpcUrl);

    try {
        const recipient = new solanaWeb3.PublicKey(to);
        let secretKey;
        let signature;

        if (privateKey.split(',').length > 1) {
            secretKey = new Uint8Array(privateKey.split(',') as any);
        } else {
            secretKey = bs58.decode(privateKey);
        }

        const from = solanaWeb3.Keypair.fromSecretKey(secretKey, {
            skipValidation: true,
        });

        if (tokenAddress) {
            // Get token mint

            const mint = await getMint(
                connection,
                new solanaWeb3.PublicKey(tokenAddress)
            );

            // Get the token account of the from address, and if it does not exist, create it
            const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                from,
                mint.address,
                from.publicKey
            );

            // Get the token account of the recipient address, and if it does not exist, create it
            const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                from,
                mint.address,
                recipient
            );

            signature = await transferToken(
                connection,
                from,
                fromTokenAccount.address,
                recipientTokenAccount.address,
                from.publicKey,
                solanaWeb3.LAMPORTS_PER_SOL * amount
            );
        } else {
            const transaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: from.publicKey,
                    toPubkey: recipient,
                    lamports: solanaWeb3.LAMPORTS_PER_SOL * amount,
                })
            );

            // Sign transaction, broadcast, and confirm
            signature = await solanaWeb3.sendAndConfirmTransaction(
                connection,
                transaction,
                [from]
            );
        }

        const tx = await connection.getTransaction(signature);

        return response({
            ...tx,
        });
    } catch (error) {
        throw error;
    }
}

const getTokenInfo = async (rpcUrl: string, cluster: 'mainnet-beta' | 'testnet' | 'devnet', address: string) => {
    try {
        const connection = getConnection(rpcUrl);
        const tokenList = await getTokenList(cluster!);
        const token = tokenList.find(token => token.address === address);

        if (token) {
            const data: ITokenInfo = {
                name: token.name,
                symbol: token.symbol,
                address: token.address,
                decimals: token.decimals,
                logoUrl: token.logoURI,
                totalSupply: 0
            }

            const totalSupply = await connection.getTokenSupply(
                new solanaWeb3.PublicKey(data.address)
            );
            data.totalSupply = totalSupply.value.uiAmount!;

            return response({ ...data });
        }
        return;
    } catch (err) {
        throw err;
    }
}

const getTokenList = async (cluster: 'mainnet-beta' | 'testnet' | 'devnet'): Promise<ISplTokenInfo[]> => {
    const response = await axios.get(SOLANA_TOKENLIST_URI);
    if (response.data && response.data.tokens) {
        return response.data.tokens.filter(
            (data: ISplTokenInfo) => data.chainId === chainId[cluster]
        );
    }
    return [];
}

const getTransaction = async (rpcUrl: string, hash: string) => {
    const connection = getConnection(rpcUrl);

    try {
        const tx = await connection.getTransaction(hash);
        return response({
            ...tx
        });
    } catch (err) {
        throw err;
    }
}

const SolanaWallet: AnyObject = {
    [CREATE_WALLET]: createWallet,
    [IMPORT_WALLET]: importWallet,
    [IMPORT_ACCOUNT]: importAccount,
    [SEND_COIN]: sendSol,
    [TRANSFER_TOKEN]: tokenTransfer,
    [GET_TOKEN]: getTokenInfo,
    [GET_TOKEN_LIST]: getTokenList,
    [GET_TRANSACTION]: getTransaction,
    [GET_BALANCE]: getBalance
}

export default SolanaWallet;