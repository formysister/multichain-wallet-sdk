/* eslint-disable */

import { ethers } from "ethers";

export const shuffleArray = (...arrayIn: any) => {
    const array = arrayIn.length === 1 && Array.isArray(arrayIn[0])
        ? arrayIn[0]
        : arrayIn;
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const fallback = async (fallbacks: any) => {
    let firstError;
    for (const fn of fallbacks) {
        if (!fn) {
            continue;
        }
        try {
            return await fn();
        }
        catch (error) {
            firstError = firstError || error;
        }
    }
    throw firstError || new Error("No result returned");
};

export const gweiToWei = (amount: string | number) => {
    const weiValue = ethers.utils.parseUnits(amount.toString(), 'gwei')
    return weiValue
}

export const gweiToEther = (amount: string | number) => {
    const weiValue = ethers.utils.parseUnits(amount.toString(), 'gwei')
    const etherValue = ethers.utils.formatEther(weiValue)

    return etherValue
}

export const weiToEther = (amount: string | number) => {
    const etherValue = ethers.utils.formatEther(amount.toString())
    return etherValue
}