import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart-actions";
import { ADD_ORDER } from "../actions/orders-actions";
import { DELETE_PRODUCT } from "../actions/products-actions";
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
      //"state" is the initialState object above
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
    case REMOVE_FROM_CART:
      //the key (action.pId) below is from store/actions/cart-actions.js
      const selectedCartItem = state.items[action.pId];
      const currentQty = selectedCartItem.quantity;
      let updatedCartItems;
      //if there are more than 1 in quantity, need to reduce the quantity (instead of deleting the item in the cart)
      if (currentQty > 1) {
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice
        );
        updatedCartItems = { ...state.items, [action.pId]: updatedCartItem };
      } else {
        updatedCartItems = { ...state.items };
        //delete this item from our COPIED object
        delete updatedCartItems[action.pId];
      }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectedCartItem.productPrice
      };
    case ADD_ORDER:
      //when you click "add to order" from your cart, it returns the initialState, which resets your cart items
      return initialState;
    case DELETE_PRODUCT:
      if (!state.items[action.pId]) {
        return state;
      }
      const updatedItems = { ...state.items };
      //the "sum" key below is from models/cart-items
      const itemTotal = state.items[action.pId].sum;
      //delete this item from our COPIED object
      delete updatedItems[action.pId];
      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - itemTotal
      };
  }
  return state;
};
