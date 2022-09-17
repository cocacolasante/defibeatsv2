import { configureStore } from '@reduxjs/toolkit'
import providerSlice from './loadProvider'

export const store = configureStore({
    reducer: {
        provider: providerSlice
    },
  })
  