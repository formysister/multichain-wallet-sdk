export interface ImportWalletPayload {
    secretKey: string;
}

export interface ImportAccountPayload {
    privateKey: string
}

export interface BalancesPayload {
    address: string;
    rpcUrl?: string;
}

export interface BalancePayload {
    address: string;
    rpcUrl?: string;
}

export interface TransferPayload {
    secretKey: string;
    senderAddress: string;
    recipientAddress: string;
    amount: number;
    rpcUrl?: string;
}