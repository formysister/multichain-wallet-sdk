type EvmWallet = {
    address: string,
    privateKey: string,
    mnemonic: string,
    nonce?: number
}

type EvmAccount = {
    address: string,
    privateKey: string
}

type ERCTokenType = 'ERC20' | 'ERC721' | 'ERC1155' | undefined

type IsNFT = {
    isNFT: boolean,
    tokenType: ERCTokenType
}

type EvmTokenDetail = {
    name: string,
    symbol: string,
    decimals: number,
    totalSupply: number,
    balance: number,
    isNft: boolean,
    tokenType: ERCTokenType
}