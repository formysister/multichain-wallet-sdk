// import EthereumWallet from '../src/wallet_class/ethereum'
import { EthereumWallet, SolanaWallet } from "../src"
import SAMPLE_DATA from './sample_data'

jest.setTimeout(50000)

describe("Wallet Test", () => {
    describe("Ethereum Wallet Test", () => {
        let ethereumWallet: EthereumWallet;

        beforeAll(() => {
            ethereumWallet = new EthereumWallet(SAMPLE_DATA.ETHEREUM.SEPOLIA_RPC)
        })

        it("Check Initial wallet data", () => {
            expect(typeof ethereumWallet.privateKey).toBe('string')
            expect(typeof ethereumWallet.address).toBe('string')
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
            const account = await ethereumWallet.createAccount()

            expect(typeof account.privateKey).toBe('string')
            expect(typeof account.address).toBe('string')
        })

        it("importAccount()", async () => {
            const seed = await ethereumWallet.createMasterSeedFromMnemonic(SAMPLE_DATA.COMMON.MNEMONIC)
            const account = await ethereumWallet.createAccount()
            const importedAccount = ethereumWallet.importAccount(account.privateKey)

            expect(account.address.toLowerCase()).toStrictEqual(importedAccount.address.toLowerCase())
        })

        it("getBalance()", async () => {
            const addressBalance = await ethereumWallet.getBalance(SAMPLE_DATA.ETHEREUM.ZERO_ADDRESS)
            const selfBalance = await ethereumWallet.getBalance()

            expect(typeof addressBalance).toBe('bigint')
            expect(typeof selfBalance).toBe('bigint')
        })

        it("getToken()", () => { })

        it("getTokenBalance()", () => { })

        it("sendEther()", () => { })

        it("tokenApprove()", () => { })

        it("tokenTransfer()", () => { })

        it("isContractAddress()", async () => {
            const isContractAddress_true = await ethereumWallet.isContractAddress(SAMPLE_DATA.ETHEREUM.SAMPLE_TOKEN_ADDRESS)
            const isContractAddress_false = await ethereumWallet.isContractAddress(SAMPLE_DATA.ETHEREUM.ZERO_ADDRESS)

            expect(isContractAddress_true).toBe(true)
            expect(isContractAddress_false).toBe(false)
        })

        it("isERC721NFT()", async () => {
            const isERC721NFT_true = await ethereumWallet.isERC721NFT(SAMPLE_DATA.ETHEREUM.SAMPLE_721_NFT_ADDRESS)
            const isERC721NFT_false = await ethereumWallet.isERC721NFT(SAMPLE_DATA.ETHEREUM.SAMPLE_1155_NFT_ADDRESS)

            expect(isERC721NFT_true).toBe(true)
            expect(isERC721NFT_false).toBe(false)
        })

        it("isERC1155NFT()", async () => {
            const isERC1155NFT_true = await ethereumWallet.isERC1155NFT(SAMPLE_DATA.ETHEREUM.SAMPLE_1155_NFT_ADDRESS)
            const isERC1155NFT_false = await ethereumWallet.isERC1155NFT(SAMPLE_DATA.ETHEREUM.SAMPLE_721_NFT_ADDRESS)

            expect(isERC1155NFT_true).toBe(true)
            expect(isERC1155NFT_false).toBe(false)
        })

        it("Util", async () => {
            const latency = await ethereumWallet.util.getJsonRPCLatency('https://sepolia.infura.io/v3/254f726a173649a896fe0d63ab2085b9')
            
            expect(typeof latency).toBe('number')
        })
    })

    describe("Solana Wallet Test", () => {
        let solanaWallet: SolanaWallet

        beforeAll(async () => {
            solanaWallet = new SolanaWallet(SAMPLE_DATA.SOLANA.SOLANA_MAINNET_RPC_URL)
            await solanaWallet.initialize()
        })

        it("createWallet()", async () => {
            const wallet = await solanaWallet.createWallet()
            expect(typeof wallet).toBe("object")
        })

        it("recoverWallet()", async () => {
            const wallet = await solanaWallet.recoverWallet(SAMPLE_DATA.COMMON.MNEMONIC)
            expect(typeof wallet).toBe("object")
        })

        it("createAccount()", async () => {
            const account = await solanaWallet.createAccount()            
            expect(typeof account.privateKey).toBe("string")
        })

        it("importAccount()", async () => {
            const account = await solanaWallet.importAccount(solanaWallet.privateKey)            
            expect(account.address.toLowerCase()).toBe(solanaWallet.address.toLowerCase())
        })

        it("getBalance()", async () => {
            const solBalance = await solanaWallet.getBalance("9DSRMyr3EfxPzxZo9wMBPku7mvcazHTHfyjhcfw5yucA")

            const tokenBalance = await solanaWallet.getBalance(
                "9DSRMyr3EfxPzxZo9wMBPku7mvcazHTHfyjhcfw5yucA",
                "ETAtLmCmsoiEEKfNrHKJ2kYy3MoABhU6NQvpSfij5tDs"
            )

            expect(typeof solBalance).toBe("number")
            expect(typeof tokenBalance).toBe("number")
        })

        it("getTokenList()", async () => {
            const tokenList = await solanaWallet.getTokenList("mainnet-beta")
            
            expect(typeof tokenList).toBe("object")
        })

        it("getTokenInfo()", async () => {
            const tokenDetail = await solanaWallet.getTokenInfo("mainnet-beta", "ETAtLmCmsoiEEKfNrHKJ2kYy3MoABhU6NQvpSfij5tDs")

            expect(typeof tokenDetail).toBe("object")
        })
    })

    // describe("BNB Beacon wallet test", () => {
    //     let beaconWallet: BinanceWallet

    //     beforeAll(() => {
    //         beaconWallet = new BinanceWallet()
    //     })

    //     it("Create wallet", () => {
    //         const wallet = beaconWallet.createWallet()

    //         expect(typeof wallet).toBe("object")
    //     })

    //     it("Recover wallet", () => {
    //         const wallet = beaconWallet.recoverWallet(SAMPLE_DATA.COMMON.MNEMONIC)

    //         expect(typeof wallet).toBe("object")
    //     })

    //     it("Import account", () => {
    //         const account = beaconWallet.importAccount(SAMPLE_DATA.BEACON.SAMPLE_PRIVATE_KEY)

    //         expect(typeof account).toBe("object")
    //     })

    //     it("Get balance", async () => {
    //         const balance = await beaconWallet.getBalance(SAMPLE_DATA.BEACON.SAMPLE_SERVER_URL, "mainnet", SAMPLE_DATA.BEACON.SAMPLE_ADDRESS)
        
    //         expect(typeof balance).toBe("string")
    //     })
    // })

    // describe("Bitcoin Wellet Test", () => {
    //     let bitcoinWallet: BitcoinWallet

    //     beforeAll(() => {
    //         bitcoinWallet = new BitcoinWallet(SAMPLE_DATA.BITCOIN.SAMPL_PRIVATE_KEY, "testnet")
    //     })

    //     it("Check Initial wallet data", () => {
    //         expect(typeof bitcoinWallet.privateKey).toBe('string')
    //         expect(typeof bitcoinWallet.address).toBe('object')
    //     })

    //     it("createWallet()", () => {
    //         const wallet = bitcoinWallet.createWallet('testnet')

    //         expect(typeof wallet.mnemonic).toBe('string')
    //         expect(typeof wallet.privateKey).toBe('string')
    //         expect(typeof wallet.address).toBe('object')
    //     })

    //     it("recoverWallet()", async () => {
    //         const wallet = await bitcoinWallet.recoverWallet("luggage flip infant wife pear forest ugly canyon elite one bread finger")

    //         expect(typeof wallet.mnemonic).toBe('string')
    //         expect(typeof wallet.privateKey).toBe('string')
    //         expect(typeof wallet.address).toBe('object')
    //     })

    //     it("importAccount()", async () => {
    //         const recoveredWallet = await bitcoinWallet.recoverWallet(SAMPLE_DATA.COMMON.MNEMONIC, "testnet")
    //         const wallet = await bitcoinWallet.importAccount(recoveredWallet.privateKey, "testnet")

    //         expect(typeof wallet.privateKey).toBe('string')
    //         expect(typeof wallet.address).toBe('object')
    //     })

    //     it("getBalance()", async () => {
    //         const balance = await bitcoinWallet.getBalance("34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo", "bitcoin")

    //         expect(typeof balance).toBe('number')
    //     })

    //     it("sendBitcoin()", async () => {
    //         const utxos = await bitcoinWallet.sendBitcoin('', 0)

    //         console.log(utxos)
    //     })
    // })
})