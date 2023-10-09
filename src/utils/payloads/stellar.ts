export interface ImportWalletPayload {
    mnemonic: string;
}

export interface ImportAccountPayload {
    privateKey: string;
}

export interface SendCoinPayload {
    privateKey: string;
    toAddress: string;
    amount: string;
    isTestnet?: boolean,
    activate?: boolean,
}

export interface GetBalancesPayload {
    publicKey: string;
    isTestnet?: boolean
}

export interface GetBalancePayload {
    publicKey: string;
    isTestnet?: boolean;
}