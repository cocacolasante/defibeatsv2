import { ethers } from 'ethers'
import {PROFILENFT_ADDRESS} from "../config"
import profileNftAbi from "../assets/profilenft.json"

export const loadProvider = async (dispatch) => {
  const {ethereum} = window
  const connection = new ethers.providers.Web3Provider(ethereum)
  dispatch({ type: 'PROVIDER_LOADED', connection })

  return connection
}

export const loadAccount = async (provider, dispatch) => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
  
    dispatch({ type: 'ACCOUNT_LOADED', account })
  
    return account
  }

export const loadProfileNft = async (provider, account, dispatch) =>{

  const ProfileNFT = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, provider)
  const currentProfile = await ProfileNFT.creatorsProfile(account)

  console.log(currentProfile[3]) // logs the position in the current profile struct from solidity
  dispatch({type: 'USER_PROFILE_LOADED', userProfile: currentProfile})

  return currentProfile

}
