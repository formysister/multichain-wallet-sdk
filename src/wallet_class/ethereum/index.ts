/* eslint-disable */
import axios from 'axios';

import { ethers } from 'ethers';
import { hdkey } from 'ethereumjs-wallet';
import { mnemonicToSeed } from 'bip39';

// import response format
import { response, walletResponse, balanceResponse } from '../../utils/response';
// import constants
import { ETHEREUM_DEFAULT } from '../../utils/constant';
// import actions
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
    TRANSFER_TOKEN,
    GET_GAS,
    ETHER_GASSTATION_API
} from '../../utils/constant';
// import ineterface
import { AnyObject } from '../../utils/globalType';
import { GasEstimationPayload } from 'utils/payloads/ethereum';
// import util functions
import {
    isContractAddress,
    isNftContract
} from '../../helper/ethereumHelper';
// import ABI
import ERC20 from '../../abi/erc20';
import ERC721 from '../../abi/erc721';

import { weiToEther, gweiToEther, gweiToWei } from '../../utils/utils';

class EthereumWallet {
    
    provider: ethers.providers.JsonRpcProvider;
    chainId: number = 0;

    constructor(rpcUrl: string) {
        this.provider = new ethers.providers.JsonRpcProvider(rpcUrl)
        
        this.provider.getNetwork().then(network => {
            this.chainId = network.chainId
        }).catch(() => {
            this.chainId = 0
        })
    }

    createWallet = async (derivationPath?: string, nonce?: number) => {
        const path = derivationPath || ETHEREUM_DEFAULT;
        const index = nonce || Math.floor(Math.random() * 10);
    
        const wallet = ethers.Wallet.createRandom({ path: path + index });
    
        const response: EvmWallet = {
            address: wallet.address,
            privateKey: wallet.privateKey,
            mnemonic: wallet.mnemonic.phrase,
            nonce: index
        }

        return response
    }

    importWallet = async (mnemonic: string, nonce?: number, derivationPath?: string) => {
        const path = derivationPath || ETHEREUM_DEFAULT;
    
        const index = nonce || 0;
    
        const wallet = ethers.Wallet.fromMnemonic(mnemonic, path + index);
    
        const response: EvmWallet = {
            address: wallet.address,
            privateKey: wallet.privateKey,
            mnemonic: wallet.mnemonic.phrase,
            nonce: index
        }

        return response
    }

    createMasterSeedFromMnemonic = async (mnemonic: string) => {
        const seed = await mnemonicToSeed(mnemonic);
        return seed;
    }

    createAccount = async (rootKey: any, nonce: number) => {
        const hdWallet = await hdkey.fromMasterSeed(rootKey);
        const wallet = hdWallet.derivePath(ETHEREUM_DEFAULT + nonce).getWallet();
        const address = `0x${wallet.getAddress().toString('hex')}`;
        const privateKey = wallet.getPrivateKey().toString('hex');
    
        const response: EvmAccount = {
            address: address,
            privateKey: privateKey
        };

        return response
    }

    importAccount = async (privateKey: string) => {
        const account = new ethers.Wallet(privateKey);
    
        const response: EvmAccount =  {
            address: account.address,
            privateKey: account.privateKey
        }

        return response
    }
}

export default EthereumWallet