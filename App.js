import React from "react";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";

import productsReducer from "./store/reducers/products";
import ShopNavigator from "./navigation/ShopNavigator";

const rootReducer = combineReducers({
  products: productsReducer
});

const store = createStore(rootReducer);

export default function App() {
  return (
    //the Provider component should be on the top of the most "top" component
    <Provider store={store}>
      <ShopNavigator />
    </Provider>
  );
}
