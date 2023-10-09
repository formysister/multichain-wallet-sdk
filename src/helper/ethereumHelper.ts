import { ethers } from "ethers";
import ERC721 from "../abi/erc721";
import { ERC721_INTERFACE_ID } from '../utils/constant';

export async function isContractAddress(rpcUrl: string, address: string) {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    try {
        const code = await provider.getCode(address);
        if (code !== '0x')
            return true;
        else
            return false;
    } catch {
        return false;
    }
}

export async function isNftContract(rpcUrl: string, address: string) {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(address, ERC721, provider);

    try {
        const isNft = await contract.supportsInterface(ERC721_INTERFACE_ID);
        if(isNft) return true;
        else return false;
    } catch {
        return false;
    }
}