import type { Signer } from "ethers"

// Evm Types

export type Wallet = {
    address: string,
    privateKey: string,
    seed?: string,
    mnemonic?: string,
    nonce?: number
}

export type EvmWallet = {
    address: string,
    privateKey: string,
    mnemonic?: string,
    nonce?: number,
    signer?: Signer
}

export type EvmAccount = {
    address: string,
    privateKey: string,
    signer?: Signer
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

// BTC Types

export type BtcNetwork = "bitcoin" | "regtest" | "testnet"

export type BtcWallet = {
    address: {
        p2pkh: string,
        bech32: string
    }
    privateKey: string,
    mnemonic: string
}

export type BtcAccount = {
    address: {
        p2pkh: string,
        bech32: string
    }
    privateKey: string
}