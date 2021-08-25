import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: '',
    room: '',
    focus: null
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
        },
        getFocusCaro: (state, action) => {
            state.focus = action.payload
        }
    }
})

export const { getValueCaro, getRoomCaro, getFocusCaro } = roomCaro.actions

export default roomCaro.reducer