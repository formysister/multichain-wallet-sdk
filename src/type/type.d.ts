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