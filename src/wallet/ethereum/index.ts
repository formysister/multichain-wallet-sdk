import Wallet from './EthereumWallet';
//import payload type
import { 
    CreateWalletPayload,
    ImportWalletPayload,
    CreateMasterSeedPayload,
    CreateAccountPayload,
    ImportAccountPayload,
    BalancePayload,
    GetTokenPayload,
    SendPayload,
    TokenApproveAndTransferPayload
} from '../../utils/payloads/ethereum';

//import Consts
import { 
    CREATE_WALLET,
    IMPORT_WALLET,
    CREATE_MASTERSEED,
    CREATE_ACCOUNT,
    IMPORT_ACCOUNT,
    GET_BALANCE,
    GET_TOKEN_BALANCE,
    GET_TOKEN,
    SEND_COIN,
    APPROVE_TOKEN,
    TRANSFER_TOKEN
} from '../../utils/constant';

/**
 * 
 * @description Create wallet
 * @param args 
 * @returns Wallet
 */
export async function createWallet(args: CreateWalletPayload) {
    const wallet = await Wallet[CREATE_WALLET](args.derivationPath, args.nonce);
    return wallet;
}

/**
 * 
 * @description Import wallet from mnemonic phrase words
 * @param args 
 * @returns Imported Wallet
 */
export async function importWallet(args: ImportWalletPayload) {
    const wallet = await Wallet[IMPORT_WALLET](args.mnemonic, args.nonce, args.derivationPath,);
    return wallet;
}


/**
 * @description Create master seed private key
 * @param args 
 * @returns Master Seed
 */
export async function createMasterSeed(args: CreateMasterSeedPayload) {
    const seed = await Wallet[CREATE_MASTERSEED](args.mnemonic);
    return seed;
}

/**
 * 
 * @description Create Wallet from root private key
 * @param args 
 * @returns Created Account
 */
export async function createAccount(args: CreateAccountPayload) {
    const account = await Wallet[CREATE_ACCOUNT](args.rootKey, args.nonce);
    return account;
}

/**
 * 
 * @description Import Account from private key
 * @param args
 * @returns Import Account
 */
export async function importAccount(args: ImportAccountPayload) {
    const account = await Wallet[IMPORT_ACCOUNT](args.privateKey);
    return account;
}

/**
 * 
 * @param args 
 * @returns Balance of current account.
 */
export async function getBalance (args: BalancePayload) {
    const balance = await Wallet[GET_BALANCE](args.defaultProviderRpcUrl, args.address);
    return balance;
}

/**
 * 
 * @param args 
 * @returns Token balance
 */
export async function getTokenBalance (args: GetTokenPayload) {
    const balance = await Wallet[GET_TOKEN_BALANCE](args.tokenAddress, args.rpcUrl, args.address)
    return balance
}

/**
 * 
 * @param args 
 * @returns Token information 
 */
export async function getToken (args: GetTokenPayload) {
    const token = await Wallet[GET_TOKEN](args.tokenAddress, args.rpcUrl, args.address);
    return token;
}

/**
 * 
 * @param args 
 * @returns transaction result
 */
export async function sendCoin(args: SendPayload) {
    const tx = await Wallet[SEND_COIN](args.rpcUrl, args.privateKey, args.receiveAddress, args.amount, args?.gasPrice, args?.gasLimit);
    return tx;
}

/**
 * 
 * @param args 
 * @returns transaction result
 */
export async function tokenApprove(args: TokenApproveAndTransferPayload) {
    const tx = await Wallet[APPROVE_TOKEN](args.rpcUrl, args.privateKey, args.receiveAddress, args.tokenAddress, args.amount, args.gasPrice, args.gasLimit);
    return tx;
}

/**
 * 
 * @param args 
 * @returns transaction result
 */
export async function tokenTransfer(args: TokenApproveAndTransferPayload) {
    const tx = await Wallet[TRANSFER_TOKEN](args.rpcUrl, args.privateKey, args.receiveAddress, args.tokenAddress, args.amount, args?.gasPrice, args?.gasLimit);
    return tx;
}