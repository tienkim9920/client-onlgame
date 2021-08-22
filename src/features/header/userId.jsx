import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: '',
    fullname: ''
}

export const userId = createSlice({
    name: 'userId',
    initialState,
    reducers: {
        getUserId: (state, action) => {
            state.value = action.payload
        },
        getFullname: (state, action) => {
            state.fullname = action.payload
        }
    }
})

export const { getUserId, getFullname } = userId.actions

export default userId.reducer