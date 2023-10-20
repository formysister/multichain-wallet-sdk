import EthereumWallet from '../src/wallet_class/ethereum'
import SAMPLE_DATA from './sample_data'

jest.setTimeout(50000)

describe("Wallet Test", () => {
    describe("Ethereum Wallet Test", () => {
        let ethereumWallet: EthereumWallet;
        
        beforeAll(() => {
            ethereumWallet = new EthereumWallet(SAMPLE_DATA.COMMON.MNEMONIC)
        })

        it("Check Initial wallet data", () => {
            expect(typeof ethereumWallet.privateKey).toBe('string')
            expect(typeof ethereumWallet.address).toBe('string')
            expect(typeof ethereumWallet.chainId).toBe('number')
        })

        it("Create Wallet", () => {
            const wallet = ethereumWallet.createWallet()
            
            expect(typeof wallet.mnemonic).toBe('string')
            expect(typeof wallet.privateKey).toBe('string')
            expect(typeof wallet.address).toBe('string')
            expect(typeof wallet.nonce).toBe('number')
        })

        it("Recover Wawllet", () => {
            const wallet = ethereumWallet.recoverWallet(SAMPLE_DATA.COMMON.MNEMONIC)

            expect(typeof wallet.privateKey).toBe('string')
            expect(typeof wallet.address).toBe('string')
            expect(typeof wallet.mnemonic).toBe('string')
            expect(typeof wallet.nonce).toBe('number')
        })

        it("Create Masterseed from Mnemonic", async () => {
            const seed = await ethereumWallet.createMasterSeedFromMnemonic(SAMPLE_DATA.COMMON.MNEMONIC)

            expect(typeof seed).toBe('object')
        })


    })
})