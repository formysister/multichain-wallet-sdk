import StellarSDK from 'stellar-sdk';
import StellarHDWallet from 'stellar-hd-wallet';
import axios from 'axios';
import { response, walletResponse } from '../../utils/response';
import { BalanceResponse } from '../../utils/responses/stellar';
import { 
    STELLAR_TESTNET_API, 
    CREATE_WALLET, 
    IMPORT_WALLET, 
    IMPORT_ACCOUNT,
    STELLAR_MAINNET_SERVER,
    STELLAR_TESTNET_SERVER,
    SEND_COIN,
    GET_BALANCES,
    GET_BALANCE
} from '../../utils/constant';
import { AnyObject } from '../../utils/globalType';

const createWallet = async () => {
    const mnemonic = StellarHDWallet.generateMnemonic({entropyBits: 128})
    const wallet = StellarHDWallet.fromMnemonic(mnemonic)

    return walletResponse({
        privateKey: wallet.getSecret(0),
        address: wallet.getPublicKey(0),
        publicKey: wallet.getPublicKey(0),
        mnemonic: mnemonic
    })
}

const importWallet = async (mnemonic: string) => {
    const wallet = StellarHDWallet.fromMnemonic(mnemonic)
    
    return walletResponse({
        privateKey: wallet.getSecret(0),
        address: wallet.getPublicKey(0),
        publicKey: wallet.getPublicKey(0),
        mnemonic: mnemonic,
    })
}

const importAccount = async (privateKey: string) => {
    const account = StellarSDK.Keypair.fromSecret(privateKey)
    return walletResponse( {
        address: account.publicKey(),
        privateKey: account.secret(),
        publicKey: account.publicKey(),
    } )
}

const sendXLM = async (privateKey: string, toAddress: string, amount: string, isTestnet?:boolean, activate?: boolean) => {
    const _isTestnet = isTestnet || false;

    const server = new StellarSDK.Server( _isTestnet ? STELLAR_TESTNET_SERVER : STELLAR_MAINNET_SERVER)
    const senderAccount = StellarSDK.Keypair.fromSecret(privateKey)

    var transaction: any;

    // Activate account
    if(_isTestnet && activate) {
        try {
            // await axios.get(STELLAR_TESTNET_API + senderAccount.publicKey())
            await axios.get(STELLAR_TESTNET_API + toAddress)
        }
        catch (_err) {
            return response({
                Error: _err
            })
        }
    }

    // Build transaction
    try {
        const [{ max_fee: { mode: fee },}, sender, ] = await Promise.all([
            server.feeStats(),
            server.loadAccount(senderAccount.publicKey()),
        ]);
    
        transaction = new StellarSDK.TransactionBuilder(sender, {
            fee,
            networkPassphrase: _isTestnet ?  StellarSDK.Networks.TESTNET : StellarSDK.Networks.MAINNET,
        }).addOperation(
            StellarSDK.Operation.payment({
                destination: toAddress,
                asset: StellarSDK.Asset.native(),
                amount,
            }),
        )
        .setTimeout(30)
        .build();
    
        transaction.sign(senderAccount);
    }
    catch (_err) {
        return response({
            Error: _err
        })
    }

    // Cast transaction
    try {
        const transactionResult = await server.submitTransaction(transaction);
        return response( transactionResult )
    } catch (_err) {
        return response({
            Error: _err,
        })
    }
}

const getBalances = async (publicKey: string, isTestnet?: boolean) => {
    const _isTestnet = isTestnet || false
    const server = new StellarSDK.Server( _isTestnet ? STELLAR_TESTNET_SERVER : STELLAR_MAINNET_SERVER)
    const account = await server.loadAccount(publicKey)
    const balances = account.balances;
    
    return response( balances )
}

const getBalance = async (publicKey: string, isTestnet?: boolean) => {
    const _isTestnet = isTestnet || false
    const server = new StellarSDK.Server( _isTestnet ? STELLAR_TESTNET_SERVER : STELLAR_MAINNET_SERVER)
    const account = await server.loadAccount(publicKey)
    const balance = account.balances.filter((item:BalanceResponse) => item.asset_type === 'native')[0]['balance']

    return walletResponse( balance )
}

const StellarWallet: AnyObject = {
    [CREATE_WALLET]: createWallet,
    [IMPORT_WALLET]: importWallet,
    [IMPORT_ACCOUNT]: importAccount,
    [SEND_COIN]: sendXLM,
    [GET_BALANCES]: getBalances,
    [GET_BALANCE]: getBalance
}

export default StellarWallet