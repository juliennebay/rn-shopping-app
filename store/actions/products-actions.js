import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";
//set products has no identifier, because we'll never dispatch it as an action, which will reach a reducer

export const fetchProducts = () => {
  return async dispatch => {
    try {
      //you can write any async code you want here (thanks to REDUX THUNK)
      //that URL below is from my Firebase...must add ".json" (that 'products' was added by me - it'll be saved as a seperate folder in firebase )
      //fetch API is built in (in React Native)
      const response = await fetch(
        "https://rn-shopping-app-69186.firebaseio.com/products.json"
      );

      if (!response.ok) {
        throw new Error("Error - something went wrong");
      }

      const resData = await response.json();
      //we'll receive an object back as our data, so we need to translate that into an array (which we use)
      const loadedProducts = [];
      //the key is the unique ID given by firebase
      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            "u1",
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }
      dispatch({ type: SET_PRODUCTS, products: loadedProducts });
    } catch (error) {
      //you can do more here, like send to customs analytics server
      throw error;
    }
  };
};

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    //getState - we can get the redux store
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-shopping-app-69186.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    dispatch({ type: DELETE_PRODUCT, pId: productId });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    //you can write any async code you want here (thanks to REDUX THUNK)
    //that URL below is from my Firebase...must add ".json" (that 'products' was added by me - it'll be saved as a seperate folder in firebase )
    //fetch API is built in (in React Native)
    //getState - we can get the redux store
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-shopping-app-69186.firebaseio.com/products.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price
        })
      }
    );

    const resData = await response.json();
    //the response includes the automatically generated id (by firebase) -- see below: id: resData.name

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title,
        description,
        imageUrl,
        price
      }
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    //getState - we can get the redux store
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-shopping-app-69186.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl
        })
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pId: id,
      productData: {
        title,
        description,
        imageUrl
      }
    });
  };
};
