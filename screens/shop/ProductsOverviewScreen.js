import React from "react";
import { FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart-actions";
import HeaderButton from "../../components/UI/HeaderButton";

const ProductsOverviewScreen = props => {
  //the key "products" in state.products below has to match the key in the rootReducer in App.js
  //and the key "availableProducts" is the key from ../store/reducers/products.
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  return (
    <FlatList
      data={products}
      //the keys below MUST MATCH the keys inside ../../models/produdct
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onViewDetail={() => {
            props.navigation.navigate({
              routeName: "ProductDetail",
              params: {
                productId: itemData.item.id,
                productTitle: itemData.item.title
              }
            });
          }}
          onAddToCart={() => {
            dispatch(cartActions.addToCart(itemData.item));
          }}
        />
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

export default ProductsOverviewScreen;
