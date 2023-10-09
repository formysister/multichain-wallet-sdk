import { AnyObject } from "../src/utils/globalType";

import * as Common from "../src/wallet/common";
import * as Ethereum from "../src/wallet/ethereum";
import * as Solana from "../src/wallet/solana";
import * as Bitcoin from "../src/wallet/bitcoin";
import * as Ripple from "../src/wallet/ripple";
import * as Beacon from "../src/wallet/binance";
import * as Tron from "../src/wallet/tron";
import * as Hedera from "../src/wallet/hedera";
import * as Stellar from "../src/wallet/stellar";
import * as Cardano from "../src/wallet/cardano";
import * as Litecoin from "../src/wallet/litecoin";

import 
{ 
    POLYGON_MAINNET_RPC_URL, 
    BINANCE_SMART_CHAIN_RPC_URL,
    AVALANCH_NETWORK_RPC_URL,
    FANTOM_OPERA_MAINNET_RPC_URL,
    ARBITRUM_ONE_MAINNET_RPC_URL,
    CRONOS_MAINNET_RPC_URL,
    ETHEREUM_MAINNET_RPC_URL_2,
    SOLANA_MAINNET_RPC_URL,
} from "../src/utils/constant";
import { ethers } from "ethers";

interface EthWallet {
    address: string;
    privateKey: string;
    mnemonic: string;
    nonce: number;
}

interface SolWallet {
    address: string;
    privateKey: string;
    mnemonic: string;
}

interface BtcWallet {
    address: string;
    privateKey: string;
    mnemonic: string;
}

interface RootRippleWallet {
    address: string;
    seed: string;
    privateKey: string;
    mnemonic: string;
}

interface NormalRippleWallet {
    publicKey: string;
    privateKey: string;
    classicAddress: string;
    seed: string;
}

interface BeaconWallet {
    mnemonic: string;
    privateKey: string;
    publicKey: string;
    address: string;
}

jest.setTimeout(50000);

describe("Common functions test", () => {
    it("Generate mnemonic", async () => {
        const mnemonic = await Common.generateMnemonic()
        expect(mnemonic.split(' ').length).toEqual(12)
    })
})

describe("EVM class blockchain Test", () => {
    describe("Ethereum Wallet Test", () => {
        let createdWallet: EthWallet, importedWallet: EthWallet;
    
        it("Create Wallet", async () => {
            createdWallet = await Ethereum.createWallet({});
    
            expect(typeof createdWallet).toBe("object");
        });
    
        it("Import Wallet", async () => {
            importedWallet = await Ethereum.importWallet({
                mnemonic: createdWallet.mnemonic,
                nonce: createdWallet.nonce,
            });
    
            expect(importedWallet).toEqual(createdWallet);
        });
    
        // it("Create master seed & account", async () => {
        //     const seed = await Ethereum.createMasterSeed({
        //         mnemonic: createdWallet.mnemonic,
        //     });
    
        //     const account = await Ethereum.createAccount({
        //         rootKey: seed,
        //         nonce: 0,
        //     });
    
        //     expect(typeof account).toBe("object");
        // });
    
        it("Import Account", async () => {
            const account = await Ethereum.importAccount({
                privateKey: importedWallet.privateKey,
            });
    
            expect(typeof account).toBe("object");
        });
    
        it("Get Balance", async () => {
            const balance = await Ethereum.getBalance({
                defaultProviderRpcUrl: ETHEREUM_MAINNET_RPC_URL_2,
                address: "0x60610c2756fEDfbfB32E94D433cFD08740683771",
            });

            expect(typeof balance).toBe("number");
        });

        it("Get Token", async () => {
            const token = await Ethereum.getToken({ tokenAddress: '0xACea9AF39ceA78F35f6465E942820A9d8CA1BDa9', rpcUrl: 'https://eth-goerli.public.blastapi.io', address: '0xa1378d240F546ed2fccc833d1A8a96D63752087F' })
        })
    });

    describe("Ethereum Goerli Wallet Test, (sendCoin(), tokenTransfer())", () => {

        it("Import Account", async () => {
            const account = await Ethereum.importAccount({
                privateKey: `2731ec85750409165ab40af323cf453dffbd853b0a02166e7804eeddceaf8f97`,
            });
    
            expect(typeof account).toBe("object");
        });
        
        // it("Send Coin", async () => {
        //     const tx = await Ethereum.sendCoin({
        //         rpcUrl: `https://goerli.infura.io/v3/60d0fc034847460da68aa4501df5fe57`,
        //         privateKey: `2731ec85750409165ab40af323cf453dffbd853b0a02166e7804eeddceaf8f97`,
        //         receiveAddress: `0x66CD8B179F7290490d8c1CF5A29f5368a572d4B9`,
        //         amount: '0.1'
        //     })
            
        //     console.log("ETH send transaction", tx.hash)
        // })
        
        // it("Transfer Token", async () => {
        //     const tx = await Ethereum.tokenTransfer({
        //         rpcUrl: `https://goerli.infura.io/v3/60d0fc034847460da68aa4501df5fe57`,
        //         privateKey: `2731ec85750409165ab40af323cf453dffbd853b0a02166e7804eeddceaf8f97`,
        //         receiveAddress: `0x66CD8B179F7290490d8c1CF5A29f5368a572d4B9`,
        //         tokenAddress: `0xc883d4f7dad93d4b7325ed2b83ed56fd95e73c42`,
        //         amount: ethers.utils.parseUnits('50', 18)
        //     })
        // })

        it("Get Balance", async () => {
            const balance = await Ethereum.getBalance({
                defaultProviderRpcUrl: `https://goerli.infura.io/v3/60d0fc034847460da68aa4501df5fe57`,
                address: "0x66CD8B179F7290490d8c1CF5A29f5368a572d4B9",
            });

            expect(typeof balance).toBe("number");
        });
    });
    
    describe("Polygon Wallet Test", () => {
        let createdWallet: EthWallet, importedWallet: EthWallet;
    
        it("Create Wallet", async () => {
            createdWallet = await Ethereum.createWallet({});
    
            expect(typeof createdWallet).toBe("object");
        });
    
        it("Import Wallet", async () => {
            importedWallet = await Ethereum.importWallet({
                mnemonic: createdWallet.mnemonic,
                nonce: createdWallet.nonce,
            });
    
            expect(importedWallet).toEqual(createdWallet);
        });
    
        // it("Create master seed & account", async () => {
        //     const seed = await Ethereum.createMasterSeed({
        //         mnemonic: createdWallet.mnemonic,
        //     });
    
        //     const account = await Ethereum.createAccount({
        //         rootKey: seed,
        //         nonce: 0,
        //     });
    
        //     expect(typeof account).toBe("object");
        // });
    
        it("Import Account", async () => {
            const account = await Ethereum.importAccount({
                privateKey: importedWallet.privateKey,
            });
    
            expect(typeof account).toBe("object");
        });
    
        it("Get Balance", async () => {
            const balance = await Ethereum.getBalance({
                defaultProviderRpcUrl: POLYGON_MAINNET_RPC_URL,
                address: "0x60610c2756fEDfbfB32E94D433cFD08740683771",
            });
    
            expect(typeof balance).toBe("number");
        });
    });
    
    describe("Binance Smart Chain Wallet Test", () => {
        let createdWallet: EthWallet, importedWallet: EthWallet;
    
        it("Create Wallet", async () => {
            createdWallet = await Ethereum.createWallet({});
    
            expect(typeof createdWallet).toBe("object");
        });
    
        it("Import Wallet", async () => {
            importedWallet = await Ethereum.importWallet({
                mnemonic: createdWallet.mnemonic,
                nonce: createdWallet.nonce,
            });
    
            expect(importedWallet).toEqual(createdWallet);
        });
    
        // it("Create master seed & account", async () => {
        //     const seed = await Ethereum.createMasterSeed({
        //         mnemonic: createdWallet.mnemonic,
        //     });
    
        //     const account = await Ethereum.createAccount({
        //         rootKey: seed,
        //         nonce: 0,
        //     });
    
        //     expect(typeof account).toBe("object");
        // });
    
        it("Import Account", async () => {
            const account = await Ethereum.importAccount({
                privateKey: importedWallet.privateKey,
            });
    
            expect(typeof account).toBe("object");
        });
    
        it("Get Balance", async () => {
            const balance = await Ethereum.getBalance({
                defaultProviderRpcUrl: BINANCE_SMART_CHAIN_RPC_URL,
                address: "0x60610c2756fEDfbfB32E94D433cFD08740683771",
            });
    
            expect(typeof balance).toBe("number");
        });
    });
    
    describe("Avalanch Wallet Test", () => {
        let createdWallet: EthWallet, importedWallet: EthWallet;
    
        it("Create Wallet", async () => {
            createdWallet = await Ethereum.createWallet({});
    
            expect(typeof createdWallet).toBe("object");
        });
    
        it("Import Wallet", async () => {
            importedWallet = await Ethereum.importWallet({
                mnemonic: createdWallet.mnemonic,
                nonce: createdWallet.nonce,
            });
    
            expect(importedWallet).toEqual(createdWallet);
        });
    
        // it("Create master seed & account", async () => {
        //     const seed = await Ethereum.createMasterSeed({
        //         mnemonic: createdWallet.mnemonic,
        //     });
    
        //     const account = await Ethereum.createAccount({
        //         rootKey: seed,
        //         nonce: 0,
        //     });
    
        //     expect(typeof account).toBe("object");
        // });
    
        it("Import Account", async () => {
            const account = await Ethereum.importAccount({
                privateKey: importedWallet.privateKey,
            });
    
            expect(typeof account).toBe("object");
        });
    
        it("Get Balance", async () => {
            const balance = await Ethereum.getBalance({
                defaultProviderRpcUrl: AVALANCH_NETWORK_RPC_URL,
                address: "0x60610c2756fEDfbfB32E94D433cFD08740683771",
            });
    
            expect(typeof balance).toBe("number");
        });
    });
    
    describe("Fantom Wallet Test", () => {
        let createdWallet: EthWallet, importedWallet: EthWallet;
    
        it("Create Wallet", async () => {
            createdWallet = await Ethereum.createWallet({});
    
            expect(typeof createdWallet).toBe("object");
        });
    
        it("Import Wallet", async () => {
            importedWallet = await Ethereum.importWallet({
                mnemonic: createdWallet.mnemonic,
                nonce: createdWallet.nonce,
            });
    
            expect(importedWallet).toEqual(createdWallet);
        });
    
        // it("Create master seed & account", async () => {
        //     const seed = await Ethereum.createMasterSeed({
        //         mnemonic: createdWallet.mnemonic,
        //     });
    
        //     const account = await Ethereum.createAccount({
        //         rootKey: seed,
        //         nonce: 0,
        //     });
    
        //     expect(typeof account).toBe("object");
        // });
    
        it("Import Account", async () => {
            const account = await Ethereum.importAccount({
                privateKey: importedWallet.privateKey,
            });
    
            expect(typeof account).toBe("object");
        });
    
        it("Get Balance", async () => {
            const balance = await Ethereum.getBalance({
                defaultProviderRpcUrl: FANTOM_OPERA_MAINNET_RPC_URL,
                address: "0x60610c2756fEDfbfB32E94D433cFD08740683771",
            });
    
            expect(typeof balance).toBe("number");
        });
    });
    
    describe("Arbitrum Wallet Test", () => {
        let createdWallet: EthWallet, importedWallet: EthWallet;
    
        it("Create Wallet", async () => {
            createdWallet = await Ethereum.createWallet({});
    
            expect(typeof createdWallet).toBe("object");
        });
    
        it("Import Wallet", async () => {
            importedWallet = await Ethereum.importWallet({
                mnemonic: createdWallet.mnemonic,
                nonce: createdWallet.nonce,
            });
    
            expect(importedWallet).toEqual(createdWallet);
        });
    
        // it("Create master seed & account", async () => {
        //     const seed = await Ethereum.createMasterSeed({
        //         mnemonic: createdWallet.mnemonic,
        //     });
    
        //     const account = await Ethereum.createAccount({
        //         rootKey: seed,
        //         nonce: 0,
        //     });
    
        //     expect(typeof account).toBe("object");
        // });
    
        it("Import Account", async () => {
            const account = await Ethereum.importAccount({
                privateKey: importedWallet.privateKey,
            });
    
            expect(typeof account).toBe("object");
        });
    
        it("Get Balance", async () => {
            const balance = await Ethereum.getBalance({
                defaultProviderRpcUrl: ARBITRUM_ONE_MAINNET_RPC_URL,
                address: "0x60610c2756fEDfbfB32E94D433cFD08740683771",
            });
    
            expect(typeof balance).toBe("number");
        });
    });
    
    describe("Cronos Wallet Test", () => {
        let createdWallet: EthWallet, importedWallet: EthWallet;
    
        it("Create Wallet", async () => {
            createdWallet = await Ethereum.createWallet({});
    
            expect(typeof createdWallet).toBe("object");
        });
    
        it("Import Wallet", async () => {
            importedWallet = await Ethereum.importWallet({
                mnemonic: createdWallet.mnemonic,
                nonce: createdWallet.nonce,
            });
    
            expect(importedWallet).toEqual(createdWallet);
        });
    
        // it("Create master seed & account", async () => {
        //     const seed = await Ethereum.createMasterSeed({
        //         mnemonic: createdWallet.mnemonic,
        //     });
    
        //     const account = await Ethereum.createAccount({
        //         rootKey: seed,
        //         nonce: 0,
        //     });
    
        //     expect(typeof account).toBe("object");
        // });
    
        it("Import Account", async () => {
            const account = await Ethereum.importAccount({
                privateKey: importedWallet.privateKey,
            });
    
            expect(typeof account).toBe("object");
        });
    
        it("Get Balance", async () => {
            const balance = await Ethereum.getBalance({
                defaultProviderRpcUrl: CRONOS_MAINNET_RPC_URL,
                address: "0x60610c2756fEDfbfB32E94D433cFD08740683771",
            });
    
            expect(typeof balance).toBe("number");
        });
    });
})

describe("Solana Test", () => {
    let createdWallet: SolWallet, importedWallet: SolWallet;

    it("Create Wallet", async () => {
        const wallet = await Solana.createWallet({});

        createdWallet = wallet;

        expect(typeof wallet).toBe("object");
    });

    it("Import Wallet", async () => {
        const wallet = await Solana.importWallet({
            mnemonic: createdWallet.mnemonic,
        });

        importedWallet = wallet;

        expect(importedWallet).toEqual(wallet);
    });

    it("Import Account", async () => {
        const account = await Solana.importAccount({
            privateKey: importedWallet.privateKey,
        });

        expect(typeof account).toBe("object");
    });

    it("Get Balance", async () => {
        const solBalance = await Solana.getBalance({
            rpcUrl: SOLANA_MAINNET_RPC_URL,
            address: "9DSRMyr3EfxPzxZo9wMBPku7mvcazHTHfyjhcfw5yucA",
        });

        const tokenBalance = await Solana.getBalance({
            rpcUrl: SOLANA_MAINNET_RPC_URL,
            address: "9DSRMyr3EfxPzxZo9wMBPku7mvcazHTHfyjhcfw5yucA",
            tokenAddress: "ETAtLmCmsoiEEKfNrHKJ2kYy3MoABhU6NQvpSfij5tDs",
        });

        expect(typeof solBalance).toBe("number");
        expect(typeof tokenBalance).toBe("number");
    });
});

describe("Test Bitcoin", () => {
    let createdWallet: BtcWallet,
        importedWallet: BtcWallet,
        randomWallet: BtcWallet;

    it("Create Wallet", async () => {
        createdWallet = await Bitcoin.createWallet({
            network: "testnet",
        });

        randomWallet = await Bitcoin.createWallet({
            network: "bitcoin",
        });

        expect(typeof createdWallet).toBe("object");
    });

    it("Import Wallet", async () => {
        importedWallet = await Bitcoin.importWallet({
            network: "bitcoin",
            mnemonic: "luggage flip infant wife pear forest ugly canyon elite one bread finger",
        });

        expect(typeof importedWallet).toBe("object");
    });

    it("Import Account", async () => {
        importedWallet = await Bitcoin.importAccount({
            network: "bitcoin",
            privateKey: createdWallet.privateKey,
        });

        expect(typeof importedWallet).toBe("object");
    });

    it("Get balance", async () => {
        const balance = await Bitcoin.getBalance({
            address: "34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo",
        });

        expect(typeof balance).toBe("object");
    });
});

describe("Ripple Test", () => {
    let createdWallet: RootRippleWallet, importedWallet: RootRippleWallet;

    it("Create Wallet", async () => {
        createdWallet = await Ripple.createWallet();
        expect(typeof createdWallet).toBe("object");
    });

    it("Import Wallet", async () => {
        importedWallet = await Ripple.importWallet({
            secretKey: "luggage flip infant wife pear forest ugly canyon elite one bread finger",
        });
        expect(typeof importedWallet).toBe("object");
    });

    it("Import Account", async () => {
        importedWallet = await Ripple.importAccount({
            privateKey: createdWallet.seed,
        });
        expect(typeof importedWallet).toBe(createdWallet);
    });

    it("Get Balances", async () => {
        const balance = await Ripple.getBalances({
            address: "rJmE49v6V6p6YLNZyncgCR6d1gs8DiVXJc",
        });

        expect(typeof balance).toBe("object");
    });

    it("Get Balance", async () => {
        const balance = await Ripple.getBalance({
            address: "rJmE49v6V6p6YLNZyncgCR6d1gs8DiVXJc",
        });

        expect(typeof balance).toBe("string");
    });
});

describe("Beacon Test", () => {
    let createdWallet: BeaconWallet, importedWallet: BeaconWallet;
    it("Create Wallet", async () => {
        createdWallet = Beacon.createWallet();
        expect(createdWallet.address.length).toBeGreaterThan(0);
    });

    it("Import Wallet", async () => {
        importedWallet = Beacon.importWallet({
            mnemonic: createdWallet.mnemonic,
        });

        expect(importedWallet).toStrictEqual(createdWallet);
    });

    it("Import Account", async () => {
        const importedAccount = Beacon.importAccount({
            privateKey: createdWallet.privateKey,
        });

        expect(typeof importedAccount).toBe('object');
    });

    it("Get Balance", async () => {
        const balance = await Beacon.getBalance({
            rpcUrl: "https://dex.binance.org/",
            address: "bnb1mnun4frf99dcqa4u4e3z0f4mhv4vrgfpchn2l0",
            network: "mainnet",
        });

        expect(typeof balance).toBe("string");
    });
});

describe("Tron Test", () => {
    var createdWallet: AnyObject, importedWallet: AnyObject, importedAccount: AnyObject;

    it("Create Wallet", async () => {
        createdWallet = await Tron.createWallet();
        expect(typeof createdWallet).toBe('object')
    });

    it("Import Wallet", async () => {
        importedWallet = await Tron.importWallet({ mnemonic: createdWallet.mnemonic })
        expect(importedWallet).toStrictEqual(createdWallet)
    })

    it("Import Account", async () => {
        importedAccount = await Tron.importAccount({
            privateKey: importedWallet.privateKey
        })

        expect(importedAccount.address).toStrictEqual(importedWallet.address)
    })

    it("Get Balance", async () => {
        const balance = await Tron.getBalance({
            address: "TABWo715YJTqBndZfm4hUu5C4h9doonfZe",
        });
    });

    it("Get Token", async () => {
        const token = await Tron.getTokenInfo({ contractAddress: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t " })

        console.warn(token)
    })
});


describe("Stellar Test", () => {
    it("Create Wallet", async () => {
        const wallet = await Stellar.createWallet()
    })

    it("Import Wallet", async () => {
        const wallet = await Stellar.importAccount({ privateKey: 'SAI7SDNUOA35ROASVNZJETIIA4HC37SG3ADHWMBTXBMN2RAPTWSP2LVR' })
    })

    it("Send Coint", async () => {
        const wallet = await Stellar.createWallet()

        const result = await Stellar.sendCoin({ 
            privateKey: 'SAI7SDNUOA35ROASVNZJETIIA4HC37SG3ADHWMBTXBMN2RAPTWSP2LVR',
            toAddress: wallet.address,
            amount: '100',
            isTestnet: true,
            activate: true
        })
    })

    it("Get Balances", async () => {
        const balances = await Stellar.getBalances({ 
            publicKey: 'GDUY7J7A33TQWOSOQGDO776GGLM3UQERL4J3SPT56F6YS4ID7MLDERI4',
            isTestnet: false
        })

        expect(typeof balances).toBe("object")
    })

    it("Get Balance", async () => {
        const balance = await Stellar.getBalance({ 
            publicKey: 'GDUY7J7A33TQWOSOQGDO776GGLM3UQERL4J3SPT56F6YS4ID7MLDERI4',
            isTestnet: false
        })

        expect(typeof balance).toBe("string")
    })
})

describe("Cardano Test", () => {
    it("Create Wallet", async () => {
        const wallet = await Cardano.createWallet()
    })

    it("Import Wallet", async () => {
        const wallet = await Cardano.importWallet({ 
            mnemonic: "luggage flip infant wife pear forest ugly canyon elite one bread finger" })
    })

    it("Get Balances", async () => {
        const balances = await Cardano.getBalances({address: 'addr_test1qp0fkj8x2peran90hvq3x8j9sp276e2d3q95wr7apsqrf73jkerthfqjpegfypm2ddcv27rs7c5z80ve2luj69ap0guqag3efu', network: 'preview' })
    })

    it("Get Balance", async () => {
        const balance = await Cardano.getBalance({address: 'addr_test1qp0fkj8x2peran90hvq3x8j9sp276e2d3q95wr7apsqrf73jkerthfqjpegfypm2ddcv27rs7c5z80ve2luj69ap0guqag3efu', network: 'preview' })
    })

    // it("Send Balance", async () => {
    //     const wallet = await Cardano.importWallet({ 
    //         mnemonic: "luggage flip infant wife pear forest ugly canyon elite one bread finger" })

    //     const result = await Cardano.sendAda({
    //         paymentKey: wallet.paymentKey,
    //         fromAddress: 'addr_test1qp0fkj8x2peran90hvq3x8j9sp276e2d3q95wr7apsqrf73jkerthfqjpegfypm2ddcv27rs7c5z80ve2luj69ap0guqag3efu',
    //         toAddress: 'addr_test1qzxpf7rnmr8asy2qz3m7z4s9hza50zwkqllkdy2kc2euxvhr5twp4xthtpp27c5qy43c68llrugeeautcerhv4nc9vusa67ryr',
    //         amount: 10,
    //         network: 'preview'
    //     })

    //     console.log(result)
    // })
})

describe("Litecoin Test", () => {
    it("Create Wallet", async () => {
        const wallet= await Litecoin.createWallet()
    })

    it("Import Wallet", async () => {
        const wallet = await Litecoin.importWallet({
            mnemonic: 'luggage flip infant wife pear forest ugly canyon elite one bread finger'
        })
    })
})