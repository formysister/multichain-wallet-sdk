export interface ImportWalletPayload {
    mnemonic: string,
    index?: number;
}

export interface GetBalancePayload {
    address: string,
    network?: 'mainnet' | 'testnet' | 'preprod' | 'preview'
}

export interface SendAdaPayload {
    paymentKey: any,
    fromAddress: string,
    toAddress: string,
    amount: number,
    network?: 'mainnet' | 'testnet' | 'preprod' | 'preview'
}