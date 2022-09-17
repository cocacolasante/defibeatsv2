import { ethers } from "ethers";
import { createSlice } from '@reduxjs/toolkit'
// import type { PayloadAction } from '@reduxjs/toolkit'

const initialState = ({
    connection: null,
    chainId: null,
    account: null
})

const providerSlice = createSlice({
    name: "provider",
    initialState: initialState,
    reducers: {
        loadProvider: (state) => {
            const connection = new ethers.providers.Web3Provider(window.ethereum)
            state.connection = connection;
            console.log("provider loaded")
        },
        loadNetwork: (state) => {
            const { chainId } = ethers.providers.getNetwork()
            state.chainId = chainId 
        },
        loadAccount: async (state) =>{
            const accounts = await window.ethereum.request({method: "eth_requestAccounts"})
            const account = ethers.utils.getAddress(accounts[0])
            state.account = account
        }
    }
})

export default providerSlice.reducer;

