export interface BalancePayload {
    address: string;
}

export interface ImportWalletPayload {
    mnemonic: string;
    nonce?: string;
}

export interface ImportAccountPayload {
    privateKey: string;
}

export interface SendTrxPayload {
    privateKey: string; 
    fromAddress: string;
    toAddress: string;
    amount: number
}

export interface GetTokenInfoPayload {
    contractAddress: string
}