import EthereumWallet from '../src/wallet_class/ethereum'

jest.setTimeout(50000)

describe("Wallet Test", () => {
    describe("Ethereum Wallet Test", () => {
        let ethereumWallet: EthereumWallet;
        
        beforeAll(() => {
            ethereumWallet = new EthereumWallet('https://goerli.infura.io/v3/60d0fc034847460da68aa4501df5fe57')
        })

        it("Check Initial wallet data", () => {
            expect(typeof ethereumWallet.privateKey).toBe('string')
            expect(typeof ethereumWallet.address).toBe('string')
            expect(typeof ethereumWallet.chainId).toBe('number')
        })

        it("Create Wallet", () => {
            const wallet = ethereumWallet.createWallet()

            expect(typeof wallet.privateKey).toBe('string')
            expect(typeof wallet.address).toBe('string')
            expect(typeof wallet.mnemonic).toBe('string')
            expect(typeof wallet.nonce).toBe('number')
        })
    })
})