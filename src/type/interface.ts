import type { BigNumber } from "ethers";

export interface EvmGasObject {
    low: number,
    average: number,
    fast: number,
    lowWei: BigNumber,
    averageWei: BigNumber,
    fastWei: BigNumber,
    lowEth: string;
    averageEth: string;
    fastEth: string;
    safeLowWaitMin: number;
    avgWaitMin: number;
    fastWaitMin: number
}