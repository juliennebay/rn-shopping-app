export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";

export const deleteProduct = productId => {
  return { type: DELETE_PRODUCT, pId: productId };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async dispatch => {
    //you can write any async code you want here (thanks to REDUX THUNK)
    //that URL below is from my Firebase...must add ".json" (that 'products' was added by me - it'll be saved as a seperate folder in firebase )
    //fetch API is built in (in React Native)
    const response = await fetch(
      "https://rn-shopping-app-69186.firebaseio.com/products.json",
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

    console.log(resData);

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
  return {
    type: UPDATE_PRODUCT,
    pId: id,
    productData: {
      title,
      description,
      imageUrl
    }
  };
};
