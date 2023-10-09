import Wallet from './CardanoWallet'
import { CREATE_WALLET, IMPORT_WALLET, GET_BALANCES, GET_BALANCE, SEND_COIN } from '../../utils/constant'
import { ImportWalletPayload, GetBalancePayload, SendAdaPayload } from '../../utils/payloads/cardano';

/**
 * 
 * @returns Cardano Shelley account wallet
 */
export async function createWallet() {
    const wallet = await Wallet[CREATE_WALLET]();
    return wallet
}

/**
 * 
 * @param args account index
 * @returns Cardano Shelley account wallet
 */
export async function importWallet(args: ImportWalletPayload) {
    const wallet = await Wallet[IMPORT_WALLET](args.mnemonic, args?.index);
    return wallet
}

/**
 * 
 * @param args payment_key_hash_bech32 | network ID
 * @returns account assets and balances
 */
export async function getBalances(args: GetBalancePayload) {
    const balances = await Wallet[GET_BALANCES](args.address, args?.network)
    return balances
}

/**
 * 
 * @param args payment_key_hash_bech32 | network ID
 * @returns ADA asset of account
 */
export async function getBalance(args: GetBalancePayload) {
    const balance = await Wallet[GET_BALANCE](args.address, args?.network)
    return balance
}

/**
 * 
 * @param args paymentkey | sender address | receiver address | ADA amount
 * @returns payment transaction hash
 */
export async function sendCoin(args: SendAdaPayload) {
    const result = await Wallet[SEND_COIN](args.paymentKey, args.fromAddress, args.toAddress, args.amount, args?.network)
    return result
}