import Wallet from './LitecoinWallet'
import { CREATE_WALLET, IMPORT_WALLET } from '../../utils/constant'
import { ImportWalletPayload } from '../../utils/payloads/litecoin'

/**
 * 
 * @param args ? derive path
 * @returns litecoin wallet
 */
export async function createWallet() {
    const wallet = Wallet[CREATE_WALLET]()
    return wallet
}

/**
 * 
 * @param args bip39 mnemonic
 * @returns litecoin wallet
 */
export async function importWallet(args: ImportWalletPayload) {
    const wallet = Wallet[IMPORT_WALLET](args.mnemonic)
    return wallet
}