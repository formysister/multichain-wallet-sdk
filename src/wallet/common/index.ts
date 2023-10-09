import * as bip39 from "bip39";

export const generateMnemonic = (): string => {
    const mnemonic: string = bip39.generateMnemonic()
    return mnemonic;
};