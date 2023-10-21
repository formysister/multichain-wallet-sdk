import bip39 from 'bip39'
import bitcoin from 'bitcoinjs-lib'
import bip32 from 'bip32'

import { BtcNetwork } from "../../type/type"
import { BITCOIN_DEFAULT, BTC_MAINNET, BTC_REGTEST, BTC_TESTNET } from "../../constant";

class BitCoinWallet {
    createWallet = (network: BtcNetwork, derivedPath?: string) => {
        let btcNetwork;

        switch(network) {
            case BTC_MAINNET:
                btcNetwork = bitcoin.networks.bitcoin;
                break;
            case BTC_REGTEST:
                btcNetwork = bitcoin.networks.regtest;
                break;
            case BTC_TESTNET:
                btcNetwork = bitcoin.networks.testnet;
                break;
            default:
                btcNetwork = bitcoin.networks.bitcoin;
                break;
        }
    
        const path = derivedPath || BITCOIN_DEFAULT;
    
        const mnemonic = bip39.generateMnemonic();
        const seed = bip39.mnemonicToSeedSync(mnemonic);
    
        const root = bip32.fromSeed(seed, btcNetwork);
    
        const account = root.derivePath(path);
        const node = account.derive(0);
    
        const address = bitcoin.payments.p2pkh({
            pubkey: node.publicKey,
            network: btcNetwork
        }).address;
    
        return {
            address: address,
            privateKey: node.toWIF(),
            mnemonic: mnemonic
        }
    }
}

export default BitCoinWallet