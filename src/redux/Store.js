import { configureStore } from '@reduxjs/toolkit'
import {providerReducer, profileNftReducer, userProfileReducer} from './reducers'



export const store = configureStore({
    reducer: {
        provider: providerReducer,
        profileNft: profileNftReducer,
        userProfile: userProfileReducer
    }
  })
  