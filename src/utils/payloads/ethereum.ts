import type { BigNumber } from "ethers";

/*Global Interface*/
export interface AnyObject {
    [key: string]: any;
}

/*Ethereum Interface*/
export interface CreateWalletPayload {
    derivationPath?: string;
    nonce?: number;
}

export interface ImportWalletPayload {
    mnemonic: string;
    nonce: number;
    derivationPath?: string;
}

export interface CreateMasterSeedPayload {
    mnemonic: string;
}

export interface CreateAccountPayload {
    rootKey: any;
    nonce: number;
}

export interface ImportAccountPayload {
    privateKey: string;
}

export interface ProviderPayload {
    rpcUrl: string;
    address: string;
}

export interface BalancePayload {
    defaultProviderRpcUrl: string;
    address: string;
}

export interface GetTokenPayload {
    rpcUrl: string;
    tokenAddress: string;
    address: string;
}

export interface SendPayload {
    rpcUrl: string;
    privateKey: string;
    receiveAddress: string;
    amount: string;
    gasPrice?: any;
    gasLimit?: any;
}

export interface TokenApproveAndTransferPayload {
    rpcUrl: string;
    privateKey: string;
    receiveAddress: string;
    tokenAddress: string;
    amount: any;
    gasPrice?: any;
    gasLimit?: any;
}

export interface GasEstimationPayload {
    low: number;
    average: number;
    fast: number;
    lowWei: BigNumber;
    averageWei: BigNumber;
    fastWei: BigNumber;
    lowEth: string;
    averageEth: string;
    fastEth: string;
    safeLowWaitMin: number;
    avgWaitMin: number;
    fastWaitMin: number
}