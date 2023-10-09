import Wallet from './StellarWallet'
import { 
    CREATE_WALLET, 
    IMPORT_WALLET, 
    IMPORT_ACCOUNT,
    SEND_COIN,
    GET_BALANCES,
    GET_BALANCE
} from '../../utils/constant'
import { 
    ImportWalletPayload, 
    ImportAccountPayload,
    SendCoinPayload,
    GetBalancesPayload,
    GetBalancePayload
} from '../../utils/payloads/stellar';

export async function createWallet() {
    const wallet = await Wallet[CREATE_WALLET]();
    return wallet
}

export async function importWallet(args: ImportWalletPayload) {
    const wallet = await Wallet[IMPORT_WALLET](args.mnemonic)
    return wallet
}

export async function importAccount(args: ImportAccountPayload) {
    const account = await Wallet[IMPORT_ACCOUNT](args.privateKey)
    return account
}

export async function sendCoin(args: SendCoinPayload) {
    const result = await Wallet[SEND_COIN](args.privateKey, args.toAddress, args.amount, args?.isTestnet, args?.activate)
    return result
}

export async function getBalances(args: GetBalancesPayload) {
    const balances = await Wallet[GET_BALANCES](args.publicKey, args?.isTestnet)
    return balances
}

export async function getBalance(args: GetBalancePayload) {
    const balance = await Wallet[GET_BALANCE](args.publicKey, args?.isTestnet)
    return balance
}