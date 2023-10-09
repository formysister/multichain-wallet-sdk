
export interface CreateWalletPayload {
    network: string;
    derivedPath?: string;
}

export interface ImportWalletPayload {
    network: string;
    mnemonic: string;
    derivedPath?: string;
}

export interface ImportAccountPayload {
    network: string;
    privateKey: string;
    derivedPath?: string;
}

export interface TransferPaload {
    network: string;
    senderPrivatekey: string;
    senderAddress: string;
    receiveAddress: string;
    amount: number;
    gasFee?: number;
}

export interface BalancePayload {
    address: string;
}