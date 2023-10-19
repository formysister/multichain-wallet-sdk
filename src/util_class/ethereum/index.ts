import axios from "axios"
import { BigNumber, ethers } from "ethers"
import { ETHER_GASSTATION_API } from "../../utils/constant"
import { EvmGasObject } from "../../type/interface"

class Util {
    static gweiToWei = (amount: string | number): BigNumber => {
        const weiValue = ethers.utils.parseUnits(amount.toString(), 'gwei')
        return weiValue
    }
    
    static gweiToEther = (amount: string | number): string => {
        const weiValue = ethers.utils.parseUnits(amount.toString(), 'gwei')
        const etherValue = ethers.utils.formatEther(weiValue)
    
        return etherValue
    }
    
    static weiToEther = (amount: string | number): string => {
        const etherValue = ethers.utils.formatEther(amount.toString())
        return etherValue
    }

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
}

export default Util