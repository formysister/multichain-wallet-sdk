import Wallet from './RippleWallet';
import { 
    CREATE_WALLET,
    IMPORT_WALLET,
    IMPORT_ACCOUNT,
    GET_BALANCE,
    GET_BALANCES,
    SEND_COIN
} from '../../utils/constant';

import { 
    ImportWalletPayload,
    ImportAccountPayload,
    BalancePayload,
    BalancesPayload,
    TransferPayload 
} from '../../utils/payloads/ripple';

/**
 * 
 * @returns Ripple Address account
 */
export async function createWallet() {
    const wallet = await Wallet[CREATE_WALLET]();
    return wallet;
}

/**
 * 
 * @param args 
 * @returns Ripple Address account
 */
export async function importWallet(args: ImportWalletPayload) {
    const wallet = await Wallet[IMPORT_WALLET](args.secretKey);
    return wallet;
}

export async function importAccount(args: ImportAccountPayload) {
    const wallet = await Wallet[IMPORT_ACCOUNT](args.privateKey)
    return wallet
}

/**
 * 
 * @param args 
 * @returns Xrp Transfer Transaction
 */
export async function sendCoin(args: TransferPayload) {
    const tx = await Wallet[SEND_COIN](args.secretKey, args.senderAddress, args.recipientAddress, args.amount, args?.rpcUrl);
    return tx;
}

/**
 * 
 * @param args 
 * @returns Assets Balances
 */
export async function getBalances(args: BalancesPayload) {
    const balances = await Wallet[GET_BALANCES](args.address, args?.rpcUrl);
    return balances;
}

/**
 * 
 * @param args 
 * @returns Native asset Balance
 */
export async function getBalance(args: BalancePayload) {
    const balance = await Wallet[GET_BALANCE](args.address, args?.rpcUrl);
    return balance
}