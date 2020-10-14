import { ADD_TO_CART } from "../actions/cart-actions";
import CartItem from "../../models/cart-item";

const initialState = {
  items: {},
  totalAmount: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      /*
      consider refactoring with destructuring. for example:

      const { product: {id, price, title} } = action

      this prevents the need to invent new variables like "addedProduct" and "prodPrice"
      */

      //the product key (action.product) below is from store/actions/cart-actions.js
      const addedProduct = action.product;
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;
      let updatedOrNewCartItem;

      //need to find out if the item already exists in items (in the cart)
      if (state.items[addedProduct.id]) {
        //already have the item in the cart - we need to update the existing one (add quantity)
        updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProduct.id].sum + prodPrice
        );
      } else {
        //if the item doesn't exist in the cart already
        //the keys below - see ../../models/cart-item.js
        updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
      }
      return {
        ...state,
        items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
        totalAmount: state.totalAmount + prodPrice
      };
  }
  return state;
};