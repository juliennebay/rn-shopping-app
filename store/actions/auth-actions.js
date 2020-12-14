import AsyncStorage from "@react-native-async-storage/async-storage";
//AsyncStorage used for "auto login" (so that the user doesn't have to login each time after refreshing page)
//AsyncStorage should be used to save data to the device, instead of LocalStorage

// export const SIGNUP = "SIGNUP";
// export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

export const authenticate = (userId, token) => {
  return { type: AUTHENTICATE, userId: userId, token: token };
};

export const signup = (email, password) => {
  //see official docs (firebase):
  //https://firebase.google.com/docs/reference/rest/auth#section-create-email-password

  //this POST request should create a new user
  return async dispatch => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBMRuScPhL-_PAlgk9FlB3CGlThkUGRVoI",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = "Something went wrong!";
      if (errorId === "EMAIL_EXISTS") {
        message = "An account with that email already exists";
      }
      throw new Error(message);
    }

    const resData = await response.json();
    //for now, we'll simply log this response data
    console.log(resData);
    //we need the token to access our API
    // dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId });
    dispatch(authenticate(resData.localId, resData.idToken));
    //expiresIn - see https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
    const expirationDate =
      //multiply by 1000 to convert from seconds to milliseconds
      new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBMRuScPhL-_PAlgk9FlB3CGlThkUGRVoI",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = "Something went wrong!";
      if (errorId === "EMAIL_NOT_FOUND") {
        message = "We couldn't find an account with that email address";
      } else if ((errorId = "INVALID_PASSWORD")) {
        message = "Not a valid password";
      }
      throw new Error(message);
    }

    const resData = await response.json();
    //for now, we'll simply log this response data
    console.log(resData);
    //we need the token to access our API
    //   dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId });
    dispatch(authenticate(resData.localId, resData.idToken));
    //expiresIn - see https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
    const expirationDate =
      //multiply by 1000 to convert from seconds to milliseconds
      new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const logout = () => {
  return { type: LOGOUT };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString()
    })
  );
};
