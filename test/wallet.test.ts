import EthereumWallet from '../src/wallet_class/ethereum'
import SAMPLE_DATA from './sample_data'

jest.setTimeout(50000)

describe("Wallet Test", () => {
    describe("Ethereum Wallet Test", () => {
        let ethereumWallet: EthereumWallet;
        
        beforeAll(() => {
            ethereumWallet = new EthereumWallet(SAMPLE_DATA.ETHEREUM.GOERLI_RPC)
        })

        it("Check Initial wallet data", () => {
            expect(typeof ethereumWallet.privateKey).toBe('string')
            expect(typeof ethereumWallet.address).toBe('string')
            expect(typeof ethereumWallet.chainId).toBe('number')
        })

        it("createWallet()", () => {
            const wallet = ethereumWallet.createWallet()
            
            expect(typeof wallet.mnemonic).toBe('string')
            expect(typeof wallet.privateKey).toBe('string')
            expect(typeof wallet.address).toBe('string')
            expect(typeof wallet.nonce).toBe('number')
        })

        it("recoverWallet()", () => {
            const wallet = ethereumWallet.recoverWallet(SAMPLE_DATA.COMMON.MNEMONIC)

            expect(typeof wallet.privateKey).toBe('string')
            expect(typeof wallet.address).toBe('string')
            expect(typeof wallet.mnemonic).toBe('string')
            expect(typeof wallet.nonce).toBe('number')
        })

        it("createMasterSeedFromMnemonic()", async () => {
            const seed = await ethereumWallet.createMasterSeedFromMnemonic(SAMPLE_DATA.COMMON.MNEMONIC)

            expect(typeof seed).toBe('object')
        })

        it("createAccount()", async () => {
            const seed = await ethereumWallet.createMasterSeedFromMnemonic(SAMPLE_DATA.COMMON.MNEMONIC)
            const account = await ethereumWallet.createAccount(seed, 0)

            expect(typeof account.privateKey).toBe('string')
            expect(typeof account.address).toBe('string')
        })

        it("importAccount()", async () => {
            const seed = await ethereumWallet.createMasterSeedFromMnemonic(SAMPLE_DATA.COMMON.MNEMONIC)
            const account = await ethereumWallet.createAccount(seed, 0)
            const importedAccount = ethereumWallet.importAccount(account.privateKey)

            expect(account.address.toLowerCase()).toStrictEqual(importedAccount.address.toLowerCase())
        })

        it("getBalance()", async () => {
            const addressBalance = await ethereumWallet.getBalance(SAMPLE_DATA.ETHEREUM.ZERO_ADDRESS)
            const selfBalance = await ethereumWallet.getBalance()
            
            expect(typeof addressBalance).toBe('object')
            expect(typeof selfBalance).toBe('object')
        })
    })
})