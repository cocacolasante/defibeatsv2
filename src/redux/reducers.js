export const providerReducer = (state = {}, action) => {
    switch (action.type) {
      case 'PROVIDER_LOADED':
        return {
          ...state,
          connection: action.connection
        }
      case 'NETWORK_LOADED':
        return {
          ...state,
          chainId: action.chainId
        }
      case 'ACCOUNT_LOADED':
        return {
          ...state,
          account: action.account
        }
      case 'ETHER_BALANCE_LOADED':
        return {
          ...state,
          balance: action.balance
        }
  
      default:
        return state
    }
  }

  const DEFAULT_STATE={
    ProfileContract:[]
  }

  export const profileNftReducer = (state=DEFAULT_STATE, action) =>{
    switch(action.type){
      case "PROFILE_NFT_CONTRACT_LOADED":
        return{
          ...state,
          ProfileContract: action.ProfileNFTContract
        }
      
      default:
        return state
    }
  }

  const USER_DEFAULT_STATE=[]

  export const userProfileReducer = (state = USER_DEFAULT_STATE, action) => {
    switch (action.type) {
      case 'USER_LOADED':
        return {
          ...state,
          user: [action.user]
        }
      
      default:
        return state
    }
  }