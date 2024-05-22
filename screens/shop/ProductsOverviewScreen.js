import React, { useState, useEffect, useCallback } from 'react';
import {
   View,
   Button,
   Text,
   StyleSheet,
   FlatList,
   Platform,
   ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
// import * as cartActions from '../../store/actions/cart';
import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/product_actions';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
   const products = useSelector(state => state.products.listProducts);
   const [isLoading, setIsLoading] = useState(false);
   const [isRefreshing, setIsRefreshing] = useState(false);
   const [error, setError] = useState();
   const dispatch = useDispatch();

   const loadProducts = useCallback(async () => {
      setError(null);
      setIsRefreshing(true);
      try {
         await dispatch(productsActions.getProducts());
      } catch (err) {
         setError(err.message)
      }
      setIsRefreshing(false);
   }, [dispatch, setIsLoading, setError]);

   useEffect(() => {
      const unsubscribe = props.navigation.addListener('focus', loadProducts)

      return () => {
         unsubscribe();
         setIsLoading(false);
         setIsRefreshing(false);
         setError();
      };
   }, [loadProducts]);

   useEffect(() => {
      setIsLoading(true);
      loadProducts().then(() => {
         setIsLoading(false);
      });
   }, [dispatch, loadProducts]);

   const selectItemHandler = (id, title) => {
      props.navigation.navigate('ProductDetail', {
         productId: id,
         productTitle: title
      });
   };

   if (error) {
      return (
         <View style={styles.centered}>
            <Text>An error occurred</Text>
            <Button title='Try again' onPress={loadProducts} color={Colors.primary} />
         </View>
      )
   }

   if (isLoading) {
      return (
         <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
         </View>
      )
   }

   if (!isLoading && products.length === 0) {
      return (
         <View style={styles.centered}>
            <Text>No products found</Text>
         </View>
      )
   }

   return (
      <FlatList
         onRefresh={loadProducts}
         refreshing={isRefreshing}
         data={products}
         keyExtractor={item => item._id}
         renderItem={itemData =>
            <ProductItem
               image={itemData.item.images[0]}
               title={itemData.item.title}
               price={itemData.item.price}
               onSelect={() => {
                  selectItemHandler(itemData.item._id, itemData.item.title)
                  // console.log(itemData)
               }}
            >
               {/* <Button
                  color={Colors.primary}
                  title='View Details'
                  onPress={() => {
                     selectItemHandler(itemData.item.id, itemData.item.title)
                  }}
               /> */}
               {/* <Button
                  color={Colors.primary}
                  title='To Cart'
                  onPress={() => {
                     dispatch(cartActions.addToCart(itemData.item))
                  }}
               /> */}
            </ProductItem>
         }
      />
   )
};

export const screenOptions = navData => {
   return {
      headerTitle: 'Trang chủ',
      headerLeft: () => (
         <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
               title='Menu'
               iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
               onPress={() => {
                  navData.navigation.toggleDrawer();
               }}
            />
         </HeaderButtons>
      ),
      headerRight: () => (
         <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
               title='Cart'
               iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
               onPress={() => {
                  navData.navigation.navigate('Cart')
               }}
            />
         </HeaderButtons>
      )
   };
}

const styles = StyleSheet.create({
   centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
   }
})

export default ProductsOverviewScreen;