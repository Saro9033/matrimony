import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import chatReducer from './slices/chatSlice'
import messageReducer from './slices/messageSlice'
import selectedChatSlice from './slices/selectedChatSlice'

export default configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: { warnAfter: 128 },
        serializableCheck: { warnAfter: 128 },
    }),

    reducer: {
        auth: authReducer,
        chat: chatReducer,
        message: messageReducer,
        selectedChat:selectedChatSlice

    }
})