export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";

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
    dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId });
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
    dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId });
  };
};
