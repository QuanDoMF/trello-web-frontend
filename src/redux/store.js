
import { configureStore } from "@reduxjs/toolkit";
import { activeBoardReducer } from "./activeBoard/activeBoardSlice";
import { activeCardReducer } from "./activeCard/activeCardSlice";
import { userReducer } from "./user/userSlice";
import notificationsReducer from "./notifications/notificationsSlice";

import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootPersistConfig = {
    key: "root",
    storage: storage,
    whitelist: ["user"]
}

const reducer = combineReducers({
    activeBoard: activeBoardReducer,
    user: userReducer,
    activeCard: activeCardReducer,
    notifications: notificationsReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, reducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
})
