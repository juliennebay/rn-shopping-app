import PRODUCTS from "../../data/dummy-data-shopping";
import { DELETE_PRODUCT } from "../actions/products-actions";

//currently using dummy products. Later they'll be arrays of appropriate products.
const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter(product => product.ownerId === "u1")
};

export default (state = initialState, action) => {
  switch (action.type) {
    //in this case, we need to remove the product from both availableProducts key AND userProducts key
    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(
          product => product.id !== action.pId
        ),
        availableProducts: state.availableProducts.filter(
          product => product.id !== action.pId
        )
      };
  }
  return state;
};
