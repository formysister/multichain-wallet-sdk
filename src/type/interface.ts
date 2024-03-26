import type { BigNumberish } from "ethers"

export interface EvmGasObject {
    low: number,
    average: number,
    fast: number,
    lowWei: BigNumberish | BigInt,
    averageWei: BigNumberish | BigInt,
    fastWei: BigNumberish | BigInt,
    lowEth: string;
    averageEth: string;
    fastEth: string;
    safeLowWaitMin: number;
    avgWaitMin: number;
    fastWaitMin: number
}

export interface ISplTokenInfo {
    chainId: number;
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    logoURI?: string;
    tags: string[];
    extensions: any;
}

export interface ITokenInfo {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    logoUrl?: string;
    totalSupply: number;
}