/* eslint-disable */
import axios from "axios";
import { shuffleArray, fallback } from "../utils/utils";
import { AnyObject } from "../utils/globalType";

interface UTXO {
    readonly txHash: string;
    readonly vOut: number;
    readonly amount: number;
    readonly scriptPubKey?: string;
    readonly confirmations: number;
}

const sortUTXOs = (a: UTXO, b: UTXO) => {
    // Sort greater values first
    if (a.amount !== b.amount) {
        return b.amount - a.amount;
    }
    // Sort older UTXOs first
    if (a.confirmations !== b.confirmations) {
        return a.confirmations - b.confirmations;
    }
    return a.txHash <= b.txHash ? -1 : 1;
};

const getAPIUrl = (testnet: string) => `https://blockstream.info/${testnet ? "testnet/" : ""}api`;

const fetchTXs = async (network: string, address: string, confirmations: number = 0, limit = 25, offset = 0, onlyUnspent = false) => {
    const url = `https://api.blockchain.info/haskoin-store/${network}/address/${address}/transactions/full?limit=${limit}&offset=${offset}`;
    const response = (await axios.get(url)).data;
    let latestBlock;
    const received = [];
    for (const tx of response) {
        latestBlock = latestBlock || (await fetchLatestBlock(network));
        const txConfirmations = tx.block && tx.block.height
            ? Math.max(latestBlock - tx.block.height + 1, 0)
            : 0;
        for (let i = 0; i < tx.outputs.length; i++) {
            const vout = tx.outputs[i];
            if (vout.address === address &&
                // If the onlyUnspent flag is true, check that the tx is unspent.
                (!onlyUnspent || vout.spent === false)) {
                received.push({
                    txHash: tx.txid,
                    amount: vout.value,
                    vOut: i,
                    confirmations: txConfirmations,
                });
            }
        }
    }
    return received
        .filter((utxo) => confirmations === 0 || utxo.confirmations >= confirmations)
        .sort(sortUTXOs);
};

const fetchLatestBlock = async (network: string) => {
    const statsUrl = `https://api.blockchain.info/haskoin-store/${network}/block/best?notx=true`;
    const statsResponse = (await axios.get(statsUrl)).data;
    return statsResponse.height;
};

const fetchUTXOsFromBlockchair = async (network: string, address: string, confirmations: number = 0) => {
    const url = `https://api.blockchair.com/${network}/dashboards/address/${address}?limit=0,100`;
    const response = (await axios.get(url)).data;
    let latestBlock = response.context.state;
    if (latestBlock === 0) {
        const statsUrl = `https://api.blockchair.com/${network}/stats`;
        const statsResponse = (await axios.get(statsUrl)).data;
        latestBlock = statsResponse.data.blocks - 1;
    }
    return response.data[address].utxo
        .map((utxo: AnyObject) => ({
            txHash: utxo.transaction_hash,
            amount: utxo.value,
            vOut: utxo.index,
            confirmations: utxo.block_id === -1 ? 0 : latestBlock - utxo.block_id + 1,
        }))
        .filter((utxo: AnyObject) => confirmations === 0 || utxo.confirmations >= confirmations)
        .sort(sortUTXOs);
};

const fetchUTXOsFromSochain = async (network: string, address: string, confirmations: number = 0) => {
    const url = `https://sochain.com/api/v2/get_tx_unspent/${network}/${address}/${confirmations}`;
    const response = await axios.get(url);
    return (response.data.data.txs.map((utxo: AnyObject) => ({
        txHash: utxo.txid,
        amount: utxo.value,
        // scriptPubKey: utxo.script_hex,
        vOut: utxo.output_no,
        confirmations: utxo.confirmations,
    })))
        .filter((utxo: AnyObject) => confirmations === 0 || utxo.confirmations >= confirmations)
        .sort(sortUTXOs);
};

const fetchUTXOsFromBlockchain = async (network: string, address: string, confirmations: number = 0, limit = 25, offset = 0) => fetchTXs(network, address, confirmations, limit, offset, true);


const fetchUTXOsFromBlockstream = async (network: string, address: string, confirmations: number = 0) => {
    const apiUrl = getAPIUrl(network);
    const response = await axios.get(`${apiUrl}/address/${address}/utxo`);
    const heightResponse = await axios.get(`${apiUrl}/blocks/tip/height`);
    return response.data
        .map((utxo: AnyObject) => ({
            txHash: utxo.txid,
            amount: utxo.value,
            vOut: utxo.vout,
            confirmations: utxo.status.confirmed
                ? 1 +
                parseInt(heightResponse.data, 10) -
                utxo.status.block_height
                : 0,
        }))
        .filter((utxo: AnyObject) => confirmations === 0 || utxo.confirmations >= confirmations)
        .sort(sortUTXOs);
};

export const fetchUTXOs = async (network: string, address: string, confirmation?: number) => {
    const _endpoints = [
        ...[shuffleArray(
            (await fetchUTXOsFromBlockchair(network, address)),
            (await fetchUTXOsFromSochain(network, address)),
            (await fetchUTXOsFromBlockchain(network, address)),
            (await fetchUTXOsFromBlockstream(network, address))
        ) ||
            shuffleArray(
                (await fetchUTXOsFromBlockchair(network, address)) ||
                (await fetchUTXOsFromSochain(network, address)) ||
                (await fetchUTXOsFromBlockchain(network, address)) ||
                (await fetchUTXOsFromBlockstream(network, address))
            )]
    ]

    return _endpoints;
}