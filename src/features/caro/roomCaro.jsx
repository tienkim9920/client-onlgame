import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: '',
    room: '',
}

export const roomCaro = createSlice({
    name: 'roomCaro',
    initialState,
    reducers: {
        getValueCaro: (state, action) => {
            state.value = action.payload
        },
        getRoomCaro: (state, action) => {
            state.room = action.payload
        }
    }
})

export const { getValueCaro, getRoomCaro } = roomCaro.actions

export default roomCaro.reducer