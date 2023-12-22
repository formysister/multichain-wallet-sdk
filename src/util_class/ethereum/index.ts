import axios from "axios"
import { ethers } from "ethers"
import { ETHER_GASSTATION_API } from "../../utils/constant"
import { EvmGasObject } from "../../type/interface"

class Util {
    /**
     * 
     * @param amount 
     * @returns {BigInt}
     */
    static gweiToWei = (amount: string | number): BigInt => {
        const weiValue = ethers.parseUnits(amount.toString(), 'gwei')
        return weiValue
    }
    
    /**
     * 
     * @param amount 
     * @returns {String}
     */
    static gweiToEther = (amount: string | number): string => {
        const weiValue = ethers.parseUnits(amount.toString(), 'gwei')
        const etherValue = ethers.formatEther(weiValue)
    
        return etherValue
    }
    
    /**
     * 
     * @param amount 
     * @returns {String}
     */
    static weiToEther = (amount: string | number): string => {
        const etherValue = ethers.formatEther(amount.toString())
        return etherValue
    }

    /**
     * 
     * @returns {Promise<EvmGasObject>}
     */
    static getGas = async (): Promise<EvmGasObject> => {
        try {
            const gasResponse = await axios.get(ETHER_GASSTATION_API)
            const estimatedGas =  gasResponse.data
    
            const low = Number(estimatedGas.safeLow / 10)
            const average = Number(estimatedGas.average / 10)
            const fast = Number(estimatedGas.fast / 10)
            const lowWei = await this.gweiToWei(low)
            const averageWei = await this.gweiToWei(average)
            const fastWei = await this.gweiToWei(fast)
            const lowEth = await this.gweiToEther(low)
            const averageEth = await this.gweiToEther(average)
            const fastEth = await this.gweiToEther(fast)
            const safeLowWaitMin = estimatedGas.safeLowWait;
            const avgWaitMin = estimatedGas.avgWait;
            const fastWaitMin = estimatedGas.fastWait;
    
            return {
                low,
                average,
                fast,
                lowWei,
                averageWei,
                fastWei,
                lowEth,
                averageEth,
                fastEth,
                safeLowWaitMin,
                avgWaitMin,
                fastWaitMin
            }
        }
        catch (error) {
            throw error
        }
    }

    /**
     * 
     * @param rpcURL 
     * @returns {Promise<number>}
     */
    static getJsonRPCLatency = async (rpcURL: string): Promise<number> => {
        try {
            const provider = new ethers.JsonRpcProvider(rpcURL)
            
            const before = Date.now()
            
            await provider.getBlock('latest')

            const after = Date.now()
            
            return after - before
        }
        catch(error) {
            throw error
        }
    }

    /**
     * 
     * @param rpcURL 
     * @returns {Promise<number>}
     */
    static getWebSocketRPCLatency = async (rpcURL: string): Promise<number> => {
        try {
            const provider = new ethers.WebSocketProvider(rpcURL)
            
            const before = Date.now()
            
            await provider.getBlock('latest')

            const after = Date.now()
            
            return after - before
        }
        catch(error) {
            throw error
        }
    }
}

export default Util