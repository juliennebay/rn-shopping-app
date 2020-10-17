import { ADD_ORDER } from "../actions/orders-actions";
import Order from "../../models/order";

const initialState = {
  orders: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_ORDER:
      //the keys below (action.orderData.itmes) are from ../actions/orders-actions.js
      const newOrder = new Order(
        new Date().toString(),
        action.orderData.items,
        action.orderData.amount,
        //the date is an object. To make it readable, we have to use a getter in models/order.js
        new Date()
      );
      return {
        ...state,
        orders: state.orders.concat(newOrder)
      };
  }

  return state;
};
