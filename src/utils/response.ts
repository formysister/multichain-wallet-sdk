interface IResponse {
    [key: string]: any;
}

interface IWalletResponse {
    address: string | unknown;
    privateKey: string;
    publicKey?: string;
    mnemonic?: string;
    nonce?: number;
    seed?: string;
}

type IBalanceResponse = number | string;

export const response = (args: IResponse) => {
    return args;
}

export const walletResponse = (args: IWalletResponse) => {
    return args;
}

export const balanceResponse = (arg: IBalanceResponse) => {
    return arg;
}