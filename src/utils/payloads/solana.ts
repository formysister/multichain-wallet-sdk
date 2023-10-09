export interface BalancePayload {
    rpcUrl: string;
    address: string;
    tokenAddress?: string;
}

export interface CreateWalletPayload {
    derivedPath?: string;
}

export interface ImportWalletPayload {
    derivedPath?: string;
    mnemonic: string;
}

export interface ImportAccountPayload {
    privateKey: string;
}

export interface TransferPayload {
    rpcUrl: string;
    privateKey: string;
    from: string;
    to: string;
    amount: number;
}

export interface TokenTransferPayload {
    rpcUrl: string;
    privateKey: string;
    tokenAddress: string;
    to: string;
    amount: number;
}

export interface TokenInfoPayload {
    rpcUrl: string;
    cluster?: 'mainnet-beta' | 'testnet' | 'devnet',
    addsress: string;
}

export interface TokenListPayload {
    cluster: 'mainnet-beta' | 'testnet' | 'devnet';
}

export interface TransactionPayload {
    rpcUrl: string;
    hash: string;
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

export interface GetTokenListPayload {
    network?: string;
    cluster?: 'mainnet-beta' | 'testnet' | 'devnet'
}