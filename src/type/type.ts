export type EvmWallet = {
    address: string,
    privateKey: string,
    mnemonic: string,
    nonce?: number
}

export type EvmAccount = {
    address: string,
    privateKey: string
}

export type ERCTokenType = 'ERC20' | 'ERC721' | 'ERC1155' | undefined

export type IsNFT = {
    isNFT: boolean,
    tokenType: ERCTokenType
}

export type EvmTokenDetail = {
    name: string,
    symbol: string,
    decimals: number,
    totalSupply: number,
    balance: number,
    isNft: boolean,
    tokenType: ERCTokenType
}

export type EvmTransaction = {
    to: string,
    from?: string,
    value?: number,
    data?: string,
    nonce?: number,
    gasLimit?: number,
    gasPrice?: number
}