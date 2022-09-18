import { configureStore } from '@reduxjs/toolkit'
import {providerReducer} from './reducers'

export const store = configureStore({
    reducer: {
        provider: providerReducer
    },
    initialState: {}
  })
  