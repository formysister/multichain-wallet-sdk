import Wallet from './HederaWallet';
import { CREATE_WALLET } from '../../utils/constant';

/**
 * @return wallet response
 */
export async function createWallet() {
    const wallet = await Wallet[CREATE_WALLET]();
    return wallet;
}