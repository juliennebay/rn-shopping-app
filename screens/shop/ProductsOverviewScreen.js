import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart-actions";
import * as productsActions from "../../store/actions/products-actions";
import Colors from "../../constants/Colors";

const ProductsOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  //the key "products" in state.products below has to match the key in the rootReducer in App.js
  //and the key "availableProducts" is the key from ../store/reducers/products.
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    // setIsLoading(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (error) {
      setError(error.message);
    }
    // setIsLoading(false);
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  //navigation listener - lecture 204
  //whenever the user goes back to this screen, it re-fetches the screen
  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadProducts
    );

    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate({
      routeName: "ProductDetail",
      params: {
        productId: id,
        productTitle: title
      }
    });
  };

  if (error) {
    return (
      <View style={styles.spinner}>
        <Text>An error has occurred!</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      //activityIndicator = built in "loading spinner"
      <View style={styles.spinner}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.spinner}>
        <Text>No products found. You can add some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      //pull to refresh screen
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      //the keys below MUST MATCH the keys inside ../../models/product
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
          // onAddToCart={() => {
          //   dispatch(cartActions.addToCart(itemData.item))
          //  }}
        >
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Colors.primary}
            title="Add To Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
          />
        </ProductItem>
      )}
    />
  );
};

ProductsOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: "All Products",
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={"ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={"ios-cart"}
          onPress={() => {
            navData.navigation.navigate({ routeName: "Cart" });
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default ProductsOverviewScreen;
