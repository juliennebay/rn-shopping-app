import Order from "../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

export const fetchOrders = () => {
  return async dispatch => {
    try {
      //currently using dummy user (u1)
      const response = await fetch(
        "https://rn-shopping-app-69186.firebaseio.com/orders/u1.json"
      );

      if (!response.ok) {
        throw new Error("Error - something went wrong");
      }

      const resData = await response.json();
      //we'll receive an object back as our data, so we need to translate that into an array (which we use)
      const loadedOrders = [];

      //the key is the unique ID given by firebase
      for (const key in resData) {
        loadedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].totalAmount,
            new Date(resData[key].date) //we make the string into an object
          )
        );
      }
      dispatch({ type: SET_ORDERS, orders: loadedOrders });
    } catch (error) {
      throw error;
    }
  };
};

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
