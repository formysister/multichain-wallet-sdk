import axios from "axios";
import { 
    CARDANO_MAINNET_SERVER, 
    CARDANO_TESTNET_SERVER, 
    CARDANO_PREPROD_SERVER, 
    CARDANO_PREVIEW_SERVER, 
    BLOCK_FROST,
    ERRORS
} from "../utils/constant";
import { milkomedaNetworks } from '@dcspark/milkomeda-constants'
import Cardano from '../lib/@emurgo/cardano-multiplatform-lib-nodejs';

export const harden = (num: number) => {
    return 0x80000000 + num;
};

export const delay = (millisecond: number) => {
    return new Promise(resolve => setTimeout(resolve, millisecond))
}

export const provider = {
    api: {
        ipfs: 'https://ipfs.blockfrost.dev/ipfs',
        base: (node = CARDANO_MAINNET_SERVER) => node,
        key: (network?: 'mainnet' | 'testnet' | 'preprod' | 'preview') => ({
            project_id: BLOCK_FROST[network || 'mainnet'],
        }),
        price: (currency = 'usd') => {
            axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=${currency}`)
            .then((res) => res.data)
            .then((res) => res['cardano'][currency])
        }
    }
}

export const getNetwork = (network: 'mainnet' | 'testnet' | 'preprod' | 'preview'): { id: string, node: string } => {
    switch(network){
        case 'mainnet':
            return { id: 'mainnet', node: CARDANO_MAINNET_SERVER }
        case 'testnet':
            return { id: 'testnet', node: CARDANO_TESTNET_SERVER }
        case 'preprod':
            return { id: 'preprod', node: CARDANO_PREPROD_SERVER }
        case 'preview':
            return { id: 'preview', node: CARDANO_PREVIEW_SERVER }
        default:
            return { id: 'mainnet', node: CARDANO_MAINNET_SERVER }
    }
}

export const blockfrostRequest = async (endpoint: string, network?: 'mainnet' | 'testnet' | 'preprod' | 'preview', headers?: any, body?: any, signal?: any) => {
    const _network_ = getNetwork(network || 'mainnet')

    let result: any;

    while(!result || result['status_code'] === 500) {
        if(result) {
            await delay(100)
        }
        const rawResult = await axios.request({
            url: provider.api.base(_network_.node) + endpoint,
            headers: {
                ...provider.api.key(network),
                ...headers,
                'Cache-Control': 'no-cache'
            },
            method: body? 'POST' : 'GET',
            // body,
            params: body,
            data: body,
            signal,
        });

        result = rawResult.data
    }

    return result
}

export const getBalanceExtended = async (paymentKeyHashBech32: string, network?: 'mainnet' | 'testnet' | 'preprod' | 'preview') => {
    const result = await blockfrostRequest(`/addresses/${paymentKeyHashBech32}/extended`, network || 'mainnet');
    if (result.error) {
      if (result.status_code === 400) throw ERRORS.invalid_api_request;
      else if (result.status_code === 500) throw ERRORS.invalid_api_request;
      else if (result.status_code === 404) throw ERRORS.address_not_activated;
      else return [];
    }
    return result['amount'];
};

export const getMilkomedaData = async (ethAddress: string, network?: 'mainnet' | 'testnet' | 'preprod' | 'preview') => {
    if(network === 'mainnet' || network === undefined || network === null) {
        const { isAllowed } = (await axios.get(`https://${milkomedaNetworks['c1-mainnet'].backendEndpoint}/v1/isAddressAllowed?address=${ethAddress}`)).data;

        const { ada, ttl_expiry, assets, current_address } = await (await axios.get(`https://${milkomedaNetworks['c1-mainnet'].backendEndpoint}/v1/stargate`)).data
        
        const protocolMagic = milkomedaNetworks['c1-mainnet'].protocolMagic

        return {
            isAllowed,
            assets: [],
            ada,
            current_address,
            protocolMagic,
            ttl: ttl_expiry
        }
    }
    else {
        const { isAllowed } = (await axios.get(`https://${milkomedaNetworks['c1-devnet'].backendEndpoint}/v1/isAddressAllowed?address=${ethAddress}`)).data;

        const { ada, ttl_expiry, assets, current_address } = await (await axios.get(`https://${milkomedaNetworks['c1-devnet'].backendEndpoint}/v1/stargate`)).data
        
        const protocolMagic = milkomedaNetworks['c1-devnet'].protocolMagic

        return {
            isAllowed,
            assets: [],
            ada,
            current_address,
            protocolMagic,
            ttl: ttl_expiry
        }
    }
}

export const getUtxos = async (address: string, network?: 'mainnet' | 'testnet' | 'preview' | 'preprod') => {
    let result: any[] = [];
    let page: number = 1;
    const limit: string =  '';

    while(true) {
        let pageResult: any = await blockfrostRequest(`/addresses/${address}/utxos?page=${page}${limit}`, network || 'mainnet')

        if(pageResult.error) {
            result = [] 
        }

        result = result.concat(pageResult)
        if(pageResult.length <= 0) break;
        page++;
    }

    let converted = await Promise.all(
        result.map(async (utxo) => await utxoFromJson(utxo, address))
    )
    
    return result

    // return converted;
}

export const utxoFromJson = async (output: any, address: string) => {

    return Cardano.TransactionUnspentOutput.new(
        Cardano.TransactionInput.new(
            Cardano.TransactionHash.from_bytes(
                Buffer.from(output.tx_hash || output.txHash, 'hex')
            ),
            Cardano.BigNum.from_str(
                (output.output_index ?? output.txId).toString()
            ),
        ),
        Cardano.TransactionOutput.new(
            Cardano.Address.from_bech32(address),
            await assetsToValue(output.amount)
        )
    )
}

export const assetsToValue = async (assets: any) => {
    const multiAsset = Cardano.MultiAsset.new();
    const lovelace = assets.find((asset: any) => asset.unit === 'lovelace');
    const policies = [
        assets
        .filter((asset: any) => asset.unit !== 'lovelace')
        .map((asset: any) => asset.unit.slice(0, 56))
    ];
    policies.forEach((policy) => {
    const policyAssets = assets.filter(
        (asset: any) => asset.unit.slice(0, 56) === policy
    );
    const assetsValue = Cardano.Assets.new();
    policyAssets.forEach((asset: any) => {
        assetsValue.insert(
            Cardano.AssetName.new(Buffer.from(asset.unit.slice(56), 'hex')),
            Cardano.BigNum.from_str(asset.quantity)
        );
    });
    multiAsset.insert(
        Cardano.ScriptHash.from_bytes(Buffer.from(policy, 'hex')),
            assetsValue
        );
    });
    const value = Cardano.Value.new(
        Cardano.BigNum.from_str(lovelace ? lovelace.quantity : '0')
    );
    if (assets.length > 1 || !lovelace) value.set_multiasset(multiAsset);
    return value;
};