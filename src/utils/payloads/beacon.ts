export interface CreateWalletPayload {
    derivedPath?: string;
}

export interface ImportWalletPayload {
    mnemonic: string;
}

export interface ImportAccountPayload {
    privateKey: string;
}

export interface GetBalancePayload {
    rpcUrl: string;
    address: string;
    network: 'testnet' | 'mainnet';
}

export interface SendBNBPayload {
    rpcUrl: string;
    privateKey: string;
    fromAddress: string;
    recipientAddress: string;
    amount: any;
    asset: string;
    network: 'testnet' | 'mainnet';
}

export interface TokenTransferPayload {
    rpcUrl: string;
    privateKey: string;
    fromAddress: string;
    recipientAddress: string;
    amount: any;
    asset: string;
    network: 'testnet' | 'mainnet';
}

export type AssetsPayload  = [
    {
        free: string;
        frozen: string;
        locked: string;
        symbol: string;
    }
]