//show this screen while the app is booting up, while it's figuring out whether the user is authenticated or not.
//we might not even see the screen when the app starts (b/c it'll be super fast)

import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
//we'll be using AsyncStorage to figure out whether we have valid token or not
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";

import Colors from "../constants/Colors";
import * as authActions from "../store/actions/auth-actions";

const StartupScreen = props => {
  const dispatch = useDispatch();
  //use AsyncStorage to see if the user is valid
  useEffect(() => {
    const tryLogin = async () => {
      //we do this, because async wouldn't be allowed on the function passed inside useEffect
      const userData = await AsyncStorage.getItem("userData"); //this key must match AsyncStorage.setItem (actions/auth-actions.js)
      if (!userData) {
        //if there's no userData, we're not logged in
        props.navigation.navigate("Auth");
        return;
      }

      //if we make it past this point, we're logged in, but the token might not be valid
      const transformedData = JSON.parse(userData);
      const { token, userId, expiryDate } = transformedData;
      const expirationDate = new Date(expiryDate);

      if (expirationDate <= new Date() || !token || !userId) {
        props.navigation.navigate("Auth");
        return;
      }

      //if we make it past this point, the user is authenticated & the user needs to be logged in
      props.navigation.navigate("Shop");
      dispatch(authActions.authenticate(userId, token));
    };

    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default StartupScreen;
