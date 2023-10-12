// Network Names
export const ETHEREUM: string = 'ETHEREUM';
export const SOLANA: string = 'SOLANA';
export const BITCOIN: string = 'BITCOIN';
export const RIPPLE: string = 'RIPPLE';

// Derived Path
export const ETHEREUM_DEFAULT: string = "m/44'/60'/0'/0/";
export const SOLANA_DEFAULT: string = "m/44'/501'/0'/0'";
export const BITCOIN_DEFAULT: string = "m/44'/0'/0'/0";
export const BNB_BEACON_DEFAULT: string = "m/44'/714'/0'/0";
export const TRON_DEFAULT: string = "m/44'/195'/0/0";
export const LITECOIN_DEFAULT: string = "m/44'/2'/0'/0";

// Ethereum Contract Data
export const ERC721_INTERFACE_ID = '0x80ac58cd';
export const ERC1155_INTERFACE_ID = '0xd9b67a26'

// Solana network cluster
export const MAINNET_BETA: string = 'mainnet-beta';
export const TESTNET: string = 'testnet';
export const DEVNET: string = 'devnet';
// Bitcoin network
export const BTC_MAINNET = 'bitcoin';
export const BTC_REGTEST = 'regtest';
export const BTC_TESTNET = 'testnet';

// Network Prototype
export const LITECOIN_NETWORK_PROTOTYPE = {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bech32: 'ltc',
    bip32: {
        public: 0x019da462,
        private: 0x019d9cfe,
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
}


// Ether Gasstation
export const ETHER_GASSTATION_APIKEY = '9218ce9ba793ff0339045d78a4161ad4b9c5d1ebad3158197514ac957d40'
export const ETHER_GASSTATION_API: string = `https://ethgasstation.info/api/ethgasAPI.json?api-key=${ETHER_GASSTATION_APIKEY}`

// Bitpay url
export const BWS_INSTANCE_URL: string = 'https://bws.bitpay.com/bws/api'

// Solana data API endpoint
export const SOLANA_TOKENLIST_URI: string = 'https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json';

// hedera account id recover api endpoint
export const GET_HEDERA_ACCOUNTID_ENDPOINT: string = 'https://mainnet-public.mirrornode.hedera.com/api/v1/accounts?accountpublickey=';

// Actions
export const CREATE_WALLET: string = 'CREATE_WALLET';
export const IMPORT_WALLET: string = 'IMPORT_WALLET';
export const CREATE_MASTERSEED: string = 'CREATE_MASTERSEED';
export const CREATE_ACCOUNT: string = 'CREATE_ACCOUNT';
export const IMPORT_ACCOUNT: string = 'IMPORT_ACCOUNT';
export const GET_BALANCE: string = 'GET_BALANCE';
export const GET_BALANCES: string = 'GET_BALANCES';
export const GET_TOKEN_BALANCE: string = 'GET_TOKEN_BALANCE';
export const GET_TOKEN: string = 'GET_TOKEN';
export const GET_TOKEN_LIST: string = 'GET_TOKEN_LIST';
export const SEND_COIN: string = 'SEND_COIN';
export const APPROVE_TOKEN: string = 'APPROVE_TOKEN';
export const TRANSFER_TOKEN: string = 'TRANSFER_TOKEN';
export const GET_TRANSACTION: string = 'GET_TRANSACTION';
export const GET_GAS: string = 'GET_GAS';

// Cardano Ada Handle
export const ADA_HANDLE = {
    mainnet: 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a',
    testnet: '8d18d786e92776c824607fd8e193ec535c79dc61ea2405ddf3b09fe3',
};
  
// Blockfrost API project ID
export const BLOCK_FROST = {
    mainnet: 'mainnetQf8DQD9zDkg91gBo2R8xmEG2IxCaS9fU',
    testnet: '',
    preprod: '',
    preview: 'previewcGGHuIlBcwBsYE7PzkEC26AMCb0LztD0'
}

// Tron API key
export const TRONGRID_API_KEY = {
    mainnet: 'f0b1e38e-7bee-485e-9d3f-69410bf30681',
    testnet: '6739be94-ee43-46af-9a62-690cf0947269',
    dappchain: 'a981e232-a995-4c81-9653-c85e4d05f599'
}

// RPC_ENDPOINTS

/////////////////////////
//////FOR EVM CHAIN//////
/////////////////////////

// Ethereum
export const ETHERRUM_MAINNET_RPC_URL_1 = 'https://mainnet.infura.io/v3/';
export const ETHEREUM_MAINNET_RPC_URL_2 = 'https://rpc.ankr.com/eth/';
// Binance Smart Chain
export const BINANCE_SMART_CHAIN_RPC_URL = 'https://bsc-dataseed2.binance.org';
// Polygon network
export const POLYGON_MAINNET_RPC_URL = 'https://polygon-rpc.com';
// Fantom network
export const FANTOM_OPERA_MAINNET_RPC_URL = 'https://rpc.ftm.tools';
// Abitrum network
export const ARBITRUM_ONE_MAINNET_RPC_URL = 'https://arb-mainnet.g.alchemy.com/v2/TDx7fOwCQUo2nF4-kzxvyIAIGMrpBmnc';
// Cronos network
export const CRONOS_MAINNET_RPC_URL = 'https://cronosrpc-1.xstaking.sg';
// Avalanch network
export const AVALANCH_NETWORK_RPC_URL = 'https://1rpc.io/avax/c';

/////////////////////////
///////S O L A N A///////
/////////////////////////
export const SOLANA_DEVNET_RPC_URL = 'https://api.devnet.solana.com/';
export const SOLANA_TESTNET_RPC_URL = 'https://api.testnet.solana.com/';
export const SOLANA_MAINNET_RPC_URL = 'https://api.mainnet-beta.solana.com';

//////////////////////////
////////R I P P L E///////
//////////////////////////
export const RIPPLE_NETWORK_RPC_URL_1 = 'https://s1.ripple.com:51234/';
export const RIPPLE_NETWORK_RPC_URL_2 = 'wss://s1.ripple.com/';

export const RIPPLE_TESTNET_RPC_URL_1 = 'https://s.altnet.rippletest.net:51234/';
export const RIPPLE_TESTNET_RPC_URL_2 = 'wss://s.altnet.rippletest.net/';

export const RIPPLE_DEVNET_RPC_URL_1 = 'https://s.devnet.rippletest.net:51234/';
export const RIPPLE_DEVNET_RPC_URL_2 = 'wss://s.devnet.rippletest.net/';

///////////////////////////
//////////T R O N//////////
///////////////////////////
export const TRON_MAINNET = 'https://api.trongrid.io';
export const TRON_SHASTA_TESTNET = 'https://api.shasta.trongrid.io';
export const TRON_NILE_TESTNET = 'https://nile.trongrid.io';
export const TRON_DAPPCHAIN = 'https://sun.tronex.io'

export const TRON_MAINNET_FULL_NODE = 'https://api.trongrid.io'
export const TRON_MAINNET_SOLIDITY_NODE = 'https://api.trongrid.io'
export const TRON_MAINNET_EVENT_SERVER = 'https://api.trongrid.io'

export const TRON_TESTNET_FULL_NODE = 'https://api.shasta.trongrid.io'
export const TRON_TESTNET_SOLIDITY_NODE = 'https://api.shasta.trongrid.io'
export const TRON_TESTNET_EVENT_SERVER = 'https://api.shasta.trongrid.io'

export const TRON_DAPPCHAIN_FULL_NDOE = 'https://sun.tronex.io'
export const TRON_DAPPCHAIN_SOLIDITY_NODE = 'https://sun.tronex.io'
export const TRON_DAPPCHAIN_EVENT_SERVER = 'https://sun.tronex.io'


///////////////////////////
///////S T E L L A R///////
///////////////////////////
export const STELLAR_MAINNET_SERVER = 'https://horizon.stellar.org/'
export const STELLAR_TESTNET_API = 'https://friendbot.stellar.org?addr='
export const STELLAR_TESTNET_SERVER = 'https://horizon-testnet.stellar.org/'


////////////////////////////
////////C A R D A N O///////
////////////////////////////
export const CARDANO_MAINNET_SERVER = 'https://cardano-mainnet.blockfrost.io/api/v0'
export const CARDANO_TESTNET_SERVER = 'https://cardano-testnet.blockfrost.io/api/v0'
export const CARDANO_PREVIEW_SERVER = 'https://cardano-preview.blockfrost.io/api/v0'
export const CARDANO_PREPROD_SERVER = 'https://cardano-preprod.blockfrost.io/api/v0'

// Errors
export const ERRORS = {
    invalid_api_request: {
        message: 'INVALID_API_REQUEST',
        description: 'Invalid API request'
    },
    address_not_activated: {
        message: 'ADDRESS_NOT_ACTIVATED',
        description: 'This address must be activated to use'
    }
}