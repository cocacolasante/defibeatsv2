import { configureStore } from '@reduxjs/toolkit'
import {providerReducer, profileNftReducer} from './reducers'

export const store = configureStore({
    reducer: {
        provider: providerReducer
    }
  })
  