import { configureStore } from '@reduxjs/toolkit'
import roomReducer from '../features/caro/roomCaro'
import userId from '../features/header/userId'

export const store = configureStore({
  reducer: {
    room: roomReducer,
    userId: userId
  },
})