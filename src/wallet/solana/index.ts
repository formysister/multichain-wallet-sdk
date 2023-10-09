//Import Wallet
import Wallet from './SolanaWallet';

//Import Actions
import { 
    CREATE_WALLET,
    IMPORT_WALLET,
    IMPORT_ACCOUNT,
    SEND_COIN,
    TRANSFER_TOKEN,
    GET_TOKEN,
    GET_TOKEN_LIST,
    GET_TRANSACTION,
    GET_BALANCE
} from '../../utils/constant';

//Import Argument Payloads
import { 
    CreateWalletPayload,
    ImportWalletPayload,
    ImportAccountPayload,
    TransferPayload,
    TokenTransferPayload,
    TokenInfoPayload,
    TokenListPayload,
    TransactionPayload,
    BalancePayload
} from '../../utils/payloads/solana';

/**
 * 
 * @param args 
 * @returns wallet
 */
export async function createWallet(args: CreateWalletPayload) {
    const wallet = await Wallet[CREATE_WALLET](args?.derivedPath);
    return wallet;
}

/**
 * 
 * @param args 
 * @returns wallet
 */
export async function importWallet(args: ImportWalletPayload) {
    const wallet = await Wallet[IMPORT_WALLET](args.mnemonic, args?.derivedPath);
    return wallet;
}

/**
 * 
 * @param args 
 * @returns account
 */
export async function importAccount(args: ImportAccountPayload) {
    const account = await Wallet[IMPORT_ACCOUNT](args.privateKey);
    return account;
}

/**
 * 
 * @param args 
 * @returns tx
 */
export async function sendCoin(args: TransferPayload) {
    const tx = await Wallet[SEND_COIN](args.rpcUrl, args.privateKey, args.from, args.to, args.amount);
    return tx;
}

/**
 * 
 * @param args 
 * @returns tx
 */
export async function transferToken(args: TokenTransferPayload) {
    const tx = await Wallet[TRANSFER_TOKEN](args.rpcUrl, args.privateKey, args.tokenAddress, args.to, args.amount);
    return tx;
}

/**
 * 
 * @param args 
 * @returns token info
 */
export async function getToken(args: TokenInfoPayload) {
    const token = await Wallet[GET_TOKEN](args.rpcUrl, args.cluster, args.addsress);
    return token;
}

/**
 * 
 * @param args 
 * @returns token list
 */
export async function getTokenList(args: TokenListPayload) {
    const tokenList = await Wallet[GET_TOKEN_LIST](args.cluster);
    return tokenList;
}

/**
 * 
 * @param args 
 * @returns tx
 */
export async function getTransaction(args: TransactionPayload) {
    const transaction = await Wallet[GET_TRANSACTION](args.rpcUrl, args.hash);
    return transaction;
}


/**
 * 
 * @param args 
 * @returns balance
 */
export async function getBalance(args: BalancePayload) {
    const balance = await Wallet[GET_BALANCE](args.rpcUrl, args.address, args.tokenAddress);
    return balance;
}