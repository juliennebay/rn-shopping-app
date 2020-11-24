import { ADD_ORDER, SET_ORDERS } from "../actions/orders-actions";
import Order from "../../models/order";
import { overflowMenuPressHandlerActionSheet } from "react-navigation-header-buttons";

const initialState = {
  orders: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDERS:
      return {
        orders: action.orders
      };
    case ADD_ORDER:
      //the keys below (action.orderData.itmes) are from ../actions/orders-actions.js
      const newOrder = new Order(
        action.orderData.id,
        action.orderData.items,
        action.orderData.amount,
        action.orderData.date
      );
      return {
        ...state,
        orders: state.orders.concat(newOrder)
      };
  }

  return state;
};
