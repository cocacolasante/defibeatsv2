import { configureStore } from '@reduxjs/toolkit'
import {provider} from './reducers'

export const store = configureStore({
    reducer: {
        provider: provider
    },
  })
  