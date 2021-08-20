import { configureStore } from '@reduxjs/toolkit'
import roomReducer from '../features/caro/roomCaro'

export const store = configureStore({
  reducer: {
    room: roomReducer,
  },
})