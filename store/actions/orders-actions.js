export const ADD_ORDER = "ADD_ORDER";

export const addOrder = (cartItems, totalAmount) => {
  return async dispatch => {
    const date = new Date();
    //send a request to store the order on a server (firebase)
    const response = await fetch(
      //orders specific to the user (u1 -- just a dummy username for now)
      "https://rn-shopping-app-69186.firebaseio.com/orders/u1.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString()
        })
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    //the response includes the automatically generated ID (by firebase)
    const resData = await response.json();

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resData.name,
        items: cartItems,
        amount: totalAmount,
        date: date
      }
    });
  };
};
