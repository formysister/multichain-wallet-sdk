import Wallet from './BinanceWallet';

import { 
    CREATE_WALLET, 
    IMPORT_WALLET,
    IMPORT_ACCOUNT,
    GET_BALANCE,
    SEND_COIN,
    TRANSFER_TOKEN
} from "../../utils/constant";
import { 
    ImportWalletPayload, 
    GetBalancePayload,
    SendBNBPayload,
    TokenTransferPayload,
    ImportAccountPayload
} from "../../utils/payloads/beacon";

export function createWallet () {
    const wallet = Wallet[CREATE_WALLET]();
    return wallet;
}

export function importWallet(args: ImportWalletPayload) {
    const wallet = Wallet[IMPORT_WALLET](args.mnemonic);
    return wallet;
}

export function importAccount(args: ImportAccountPayload) {
    const wallet = Wallet[IMPORT_ACCOUNT](args.privateKey);
    return wallet;
}

export async function getBalance(args: GetBalancePayload) {
    const balance = await Wallet[GET_BALANCE](args.rpcUrl, args.address, args.network);
    return balance;
}

export async function sendCion(args: SendBNBPayload) {
    const tx = await Wallet[SEND_COIN](args.rpcUrl, args.privateKey, args.fromAddress, args.recipientAddress, args.amount, args.network);
    return tx;
}

export async function tokenTransfer(args: TokenTransferPayload) {
    const tx = await Wallet[TRANSFER_TOKEN](args.rpcUrl, args.privateKey, args.fromAddress, args.recipientAddress, args.amount, args.network, args.asset);
    return tx;
}