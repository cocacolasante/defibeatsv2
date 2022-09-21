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

export const loadProfileNftContract = async (provider, dispatch) =>{
  let ProfileNFTContract

  ProfileNFTContract = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, provider)
  
  dispatch({type: 'PROFILE_NFT_CONTRACT_LOADED', ProfileNFTContract})

  return ProfileNFTContract

}

export const loadProfile = async (account, provider, dispatch) =>{
  let ProfileNFTContract, userProfile

  ProfileNFTContract = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, provider)
  userProfile = await ProfileNFTContract.creatorsProfile(account)
  
  dispatch({type: 'USER_PROFILE_LOADED', userProfile})
  
  return userProfile
}
