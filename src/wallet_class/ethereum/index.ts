/* eslint-disable */

// import core-packages
import { Contract, ContractInterface, Interface, InterfaceAbi, ethers } from '../../lib/ethers';
import { hdkey } from 'ethereumjs-wallet';
import { mnemonicToSeed } from 'bip39';

// import constants
import {
    ERC721_INTERFACE_ID,
    ERC1155_INTERFACE_ID,
    ETHEREUM_DEFAULT
} from '../../constant';
// import ABI
import { erc20ABI, ecr721ABI, erc1155ABI } from '../../abi'
// import Util class
import Util from '../../util_class/ethereum';

// import types
import { EvmWallet, EvmAccount, EvmTokenDetail, ERCTokenType, IsNFT } from '../../type/type';

class EthereumWallet {
    // Network data
    provider: ethers.JsonRpcProvider
    chainId: number | BigInt = 0

    // Wallet main data
    privateKey: string
    address: string
    signer: ethers.Wallet

    // Utility helper library
    Util: Util = Util

    /**
     * 
     * @param rpcUrl 
     * @param privateKey 
     */
    constructor(rpcUrl: string, privateKey?: string) {
        this.provider = new ethers.JsonRpcProvider(rpcUrl)
        
        this.provider.getNetwork().then(network => {
            this.chainId = network.chainId
        }).catch(() => {
            this.chainId = 0
        })

        if(privateKey) {
            this.signer = new ethers.Wallet(privateKey, this.provider)
            this.privateKey = privateKey
            this.address = this.signer.address
        }
        else {
            const _tempWallet = this.createWallet()
            this.signer = new ethers.Wallet(_tempWallet.privateKey, this.provider)
            this.privateKey = _tempWallet.privateKey
            this.address = _tempWallet.address
        }
    }

    /**
     * 
     * @param derivationPath 
     * @param nonce 
     * @returns {EvmWallet}
     */
    createWallet = (nonce?: number): EvmWallet => {
        const index = nonce || Math.floor(Math.random() * 10);
    
        const wallet = ethers.Wallet.createRandom();

        return {
            address: wallet.address,
            privateKey: wallet.privateKey,
            mnemonic: wallet.mnemonic?.phrase,
            nonce: index
        }
    }

    /**
     * 
     * @param mnemonic 
     * @param nonce 
     * @param derivationPath 
     * @returns {EvmWallet}
     */
    recoverWallet = (mnemonic: string, nonce?: number): EvmWallet => {
    
        const index = nonce || 0;
    
        const wallet = ethers.Wallet.fromPhrase(mnemonic);

        return {
            address: wallet.address,
            privateKey: wallet.privateKey,
            mnemonic: wallet.mnemonic?.phrase,
            nonce: index
        }
    }

    /**
     * 
     * @param mnemonic 
     * @returns {Promise<Buffer>}
     */
    createMasterSeedFromMnemonic = async (mnemonic: string): Promise<Buffer> => {
        try {
            const seed = await mnemonicToSeed(mnemonic);
            return seed;
        }
        catch(error) {
            throw error
        }
    }

    /**
     * 
     * @param rootSeed 
     * @param nonce 
     * @returns {Promise<EvmAccount>}
     */
    createAccount = async (rootSeed: Buffer, nonce?: number): Promise<EvmAccount> => {
        try {
            const hdWallet = await hdkey.fromMasterSeed(rootSeed);
            const wallet = hdWallet.derivePath(ETHEREUM_DEFAULT + (nonce || 0)).getWallet();
            const address = `0x${wallet.getAddress().toString('hex')}`;
            const privateKey = wallet.getPrivateKey().toString('hex');
        
            return {
                address: address,
                privateKey: privateKey
            };
        }
        catch(error) {
            throw error
        }
    }

    /**
     * 
     * @param privateKey 
     * @returns {EvmAccount}
     */
    importAccount = (privateKey: string): EvmAccount => {
        const account = new ethers.Wallet(privateKey);
    
        return {
            address: account.address,
            privateKey: account.privateKey
        }
    }

    /**
     * 
     * @param address 
     * @returns {Promise<BigInt>}
     */
    getBalance = async (address?: string): Promise<BigInt> => {
        const balance = await this.provider.getBalance(address || this.address);
        return balance
    }

    /**
     * 
     * @param tokenAddress 
     * @param address 
     * @param tokenId 
     * @returns {Promise<EvmTokenDetail>}
     */
    getToken = async (tokenAddress: string, address?: string, tokenId?: number): Promise<EvmTokenDetail> => {
        const isContract = await this.isContractAddress(tokenAddress)
        let contract: ethers.Contract
        let tokenDetail: EvmTokenDetail

        if (!isContract) {
            tokenDetail = {
                name: '',
                symbol: '',
                decimals: 0,
                totalSupply: 0,
                balance: 0,
                isNft: false,
                tokenType: undefined
            }
        }
        else {
            const isNFT = await this.isNftContract(tokenAddress)
            if(isNFT.tokenType === 'ERC721') {
                contract = new ethers.Contract(tokenAddress, ecr721ABI, this.provider)

                try {
                    const [name, symbol, decimals, totalSupply, balance] = await Promise.all([
                        contract.name(),
                        contract.symbol(),
                        contract.decimals(),
                        contract.totalSupply(),
                        contract.balanceOf(address || this.address)
                    ]);
    
                    tokenDetail = {
                        name: name,
                        symbol: symbol,
                        decimals: decimals,
                        totalSupply: totalSupply,
                        balance: balance,
                        isNft: isNFT.isNFT,
                        tokenType: isNFT.tokenType
                    }
                } catch (error) {
                    throw error
                }
            }
            else if (isNFT.tokenType === 'ERC1155') {
                contract = new ethers.Contract(tokenAddress, erc1155ABI, this.provider)

                try {
                    const [name, symbol, decimals, totalSupply, balance] = await Promise.all([
                        contract.name(),
                        contract.symbol(),
                        contract.decimals(),
                        contract.totalSupply(),
                        tokenId ? contract.balanceOf(address || this.address, tokenId) : () =>  { return 0 }
                    ]);
    
                    tokenDetail = {
                        name: name,
                        symbol: symbol,
                        decimals: decimals,
                        totalSupply: totalSupply,
                        balance: balance,
                        isNft: isNFT.isNFT,
                        tokenType: isNFT.tokenType
                    }
                } catch (error) {
                    throw error
                }
            }
            else {
                contract = new ethers.Contract(tokenAddress, erc20ABI, this.provider)
    
                try {
                    const [name, symbol, decimals, totalSupply, balance] = await Promise.all([
                        contract.name(),
                        contract.symbol(),
                        contract.decimals(),
                        contract.totalSupply(),
                        contract.balanceOf(address || this.address)
                    ]);
    
                    tokenDetail = {
                        name: name,
                        symbol: symbol,
                        decimals: decimals,
                        totalSupply: totalSupply,
                        balance: balance,
                        isNft: isNFT.isNFT,
                        tokenType: isNFT.tokenType
                    }
                } catch (error) {
                    throw error
                }
            }
        }

        return tokenDetail
    }

    /**
     * 
     * @param tokenAddress 
     * @param address 
     * @returns {Promise<BigInt>}
     */
    getTokenBalance = async (tokenAddress: string, address?: string): Promise<BigInt> => {
        try {
            const contract = new ethers.Contract(tokenAddress, erc20ABI, this.provider);
    
            const balance = await contract.balanceOf(address || this.address)
    
            return balance
        }
        catch (error) {
            throw error
        }
    }

    /**
     * 
     * @param receiveAddress 
     * @param amount 
     * @param gasPrice 
     * @param gasLimit 
     * @returns {Promise<ethers.TransactionResponse>}
     */
    sendEther = async (receiveAddress: string, amount: string, gasPrice?: any, gasLimit?: any): Promise<ethers.TransactionResponse> => {
        try {
            let tx: ethers.TransactionResponse;

            if(gasPrice && gasLimit) {
                tx = await this.signer.sendTransaction({
                    to: receiveAddress,
                    value: ethers.parseUnits(amount),
                    gasPrice,
                    gasLimit
                })
            }
            else {
                tx = await this.signer.sendTransaction({
                    to: receiveAddress,
                    value: ethers.parseEther(amount),
                })
            }

            return tx;
        }
        catch (error) {
            throw error
        }
    }

    /**
     * 
     * @param tokenAddress 
     * @param receiveAddress 
     * @param amount 
     * @param gasPrice 
     * @param gasLimit 
     * @returns {Promise<ethers.TransactionResponse>}
     */
    tokenApprove = async (tokenAddress: string, amount: string, receiveAddress: string, gasPrice?: any, gasLimit?: any): Promise<ethers.TransactionResponse> => {
        const contract = new ethers.Contract(tokenAddress, erc20ABI, this.signer);
    
        try {
            let tx: ethers.TransactionResponse;
    
            if(gasPrice && gasLimit) {
                tx = await contract.approve(receiveAddress, amount, { gasPrice: gasPrice, gasLimit: gasLimit });
            }
            else {
                tx = await contract.approve(receiveAddress, amount);
            }
    
            return tx
        } catch (error) {
            throw error
        }
    }

    /**
     * 
     * @param tokenAddress 
     * @param amount 
     * @param receiveAddress 
     * @param gasPrice 
     * @param gasLimit 
     * @returns {Promise<ethers.TransactionResponse>}
     */
    tokenTransfer = async (tokenAddress: string, amount: any, receiveAddress: string, gasPrice?: any, gasLimit?: any): Promise<ethers.TransactionResponse> => {
        const contract = new ethers.Contract(tokenAddress, erc20ABI, this.signer);
    
        try {
            let tx: ethers.TransactionResponse;
            if(gasPrice && gasLimit) {
                tx = await contract.transfer(receiveAddress, amount, { gasPrice, gasLimit });
            }
            else {
                tx = await contract.transfer(receiveAddress, amount);
            }
            return tx
        } catch (error) {
            throw error
        }
    }

    /* util function  */

    /**
     * 
     * @param address 
     * @returns {Promise<boolean>}
     */
    isContractAddress = async (address: string): Promise<boolean> => {
        try {
            const code = await this.provider.getCode(address);
            if (code !== '0x')
                return true;
            else
                return false;
        } catch {
            return false;
        }
    }

    /**
     * 
     * @param address 
     * @returns {Promise<IsNFT>}
     */
    isNftContract = async (address: string): Promise<IsNFT> => {

        let isNFT: boolean
        let tokenType: ERCTokenType

        try {
            const isERC721NFT = await this.isERC721NFT(address)
            const isERC1155NFT = await this.isERC1155NFT(address)

            if(isERC721NFT) {
                isNFT = true
                tokenType = 'ERC721'
            }
            else if(isERC1155NFT) {
                isNFT = true
                tokenType = 'ERC1155'
            }
            else {
                isNFT = false
                tokenType = 'ERC20'
            }

            return { isNFT, tokenType }
        }
        catch(error) {
            throw error
        }
    }

    /**
     * 
     * @param address 
     * @returns {Promise<boolean>}
     */
    isERC721NFT = async (address: string): Promise<boolean> => {
        const contract = new ethers.Contract(address, ecr721ABI, this.provider)

        try {
            const is721NFT = await contract.supportsInterface(ERC721_INTERFACE_ID);
            if(is721NFT) return true
            else return false
        } catch {
            return false;
        }
    }

    /**
     * 
     * @param address 
     * @returns {Promise<boolean>}
     */
    isERC1155NFT = async (address: string): Promise<boolean> => {
        const contract = new ethers.Contract(address, erc1155ABI, this.provider)

        try {
            const is1155NFT = await contract.supportsInterface(ERC1155_INTERFACE_ID);
            if(is1155NFT) return true
            else return false
        } catch {
            return false;
        }
    }

    /**
     * 
     * @param address 
     * @param abi 
     * @returns {Contract}
     */
    getContract = (address: string, abi: Interface | InterfaceAbi): Contract => {
        const contract = new ethers.Contract(address, abi, this.provider)

        return contract
    }
}

export default EthereumWallet