import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Button
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import * as cartActions from "../../store/actions/cart-actions";

const ProductDetailScreen = props => {
  //the param below (productId) was passed in ProductOverviewScreen.js
  const productId = props.navigation.getParam("productId");
  const selectedProduct = useSelector(state =>
    //the key "products" must match the key in the rootReducer in App.js
    //and the key "availableProducts" is the key from ../store/reducers/products.
    state.products.availableProducts.find(prod => prod.id === productId)
  );
  const dispatch = useDispatch();

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.buttonAction}>
        <Button
          color={Colors.primary}
          title="Add to Cart"
          onPress={() => {
            dispatch(cartActions.addToCart(selectedProduct));
          }}
        />
      </View>
      <Text style={styles.price}>$ {selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

//we get this navData object, which also has the navigation prop
ProductDetailScreen.navigationOptions = navData => {
  return {
    //the param below (productTitle) was passed in ProductOverviewScreen.js
    headerTitle: navData.navigation.getParam("productTitle")
  };
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300
  },
  price: {
    fontFamily: "open-sans-bold",
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginVertical: 20
  },
  description: {
    fontFamily: "open-sans",
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 20
  },
  buttonAction: {
    marginVertical: 10,
    alignItems: "center"
  }
});

export default ProductDetailScreen;
