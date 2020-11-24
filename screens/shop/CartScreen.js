import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  ActivityIndicator
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";

import CartItem from "../../components/shop/CartItem";
import * as cartActions from "../../store/actions/cart-actions";
import * as ordersActions from "../../store/actions/orders-actions";

const CartScreen = prop => {
  const [isLoading, setIsLoading] = useState(false);

  //the key "cart" below is from App.js's "const rootReducer"
  //and the key "totalAmount" below is from the initialState under "../reducers/cart"
  const cartTotalAmount = useSelector(state => state.cart.totalAmount);
  //cartItems is an object (see initialState under store/reducers/cart), and we use the for loop below, so that it'll return an array,
  //which we can work with below (we made it so that if the cart is empty, the "order now" is disabled -- see below)
  const cartItems = useSelector(state => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        //the keys below are based on models/cart-item.js
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum
      });
    }
    return transformedCartItems.sort((a, b) => a.productId > b.productId);
  });
  const dispatch = useDispatch();

  const sendOrderHandler = async () => {
    setIsLoading(true);
    //reminder: dispatch here returns a promise
    await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
    setIsLoading(false);
  };

  //the flatList data used (below) is the array defined above.
  //it needs a keyExtractor because there's no key or ID property in the array
  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{" "}
          <Text style={styles.amount}>
            ${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Button
            color={Colors.secondary}
            title="Order Now"
            disabled={cartItems.length === 0}
            onPress={sendOrderHandler}
          />
        )}
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.productId}
        renderItem={itemData => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            deletable
            //the key "productId" below is from line 20 above
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemData.item.productId));
            }}
          />
        )}
      />
    </View>
  );
};

CartScreen.navigationOptions = {
  headerTitle: "Your Cart"
};

const styles = StyleSheet.create({
  screen: {
    margin: 20
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white"
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18
  },
  amount: {
    color: Colors.primary
  }
});

export default CartScreen;
