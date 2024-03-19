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