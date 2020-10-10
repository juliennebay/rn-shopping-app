import PRODUCTS from "../../data/dummy-data-shopping";

//currently using dummy products. Later they'll be arrays of appropriate products.
const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter(product => product.ownerId === "u1")
};

export default (state = initialState, action) => {
  return state;
};
