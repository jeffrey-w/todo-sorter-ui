import { createStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import listReducer from "./list-slice";

export const store = createStore(persistReducer({
    key: "root",
    storage: storage,
}, listReducer));
export const persistor = persistStore(store);