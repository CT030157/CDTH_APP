import React, { useState, useEffect, useCallback } from 'react';
import {
   View,
   Button,
   Text,
   StyleSheet,
   FlatList,
   Platform,
   ActivityIndicator,
   ScrollView,
   TextInput
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Icon } from 'react-native-elements/dist/icons/Icon';

import ProductItem from '../../components/shop/ProductItem';
// import * as cartActions from '../../store/actions/cart';
import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/product_actions';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
   const products = useSelector(state => state.products.listProducts);
   const userData = useSelector(state => state.user.userData);
   const [isLoading, setIsLoading] = useState(false);
   const [isRefreshing, setIsRefreshing] = useState(false);
   const [error, setError] = useState();
   const [text, setText] = useState('');
   const dispatch = useDispatch();

   const loadProducts = useCallback(async () => {
      setError(null);
      setIsRefreshing(true);
      if (userData._id){
         try {
            await dispatch(productsActions.getProducts(userData._id));
         } catch (err) {
            setError(err.message)
         }
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

   const filterData = (data) => {
      if (text.trim() !== ''){
         data = data.filter(item =>item.title.toLowerCase().includes(text.toLowerCase()));
      }
      return data;
   }

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
            <Text>Chưa có sản phẩm</Text>
         </View>
      )
   }

   return (
      <ScrollView>
         <TextInput
            style={styles.input}
            onChangeText={setText}
            value={text}
            placeholder='Tìm kiếm sản phẩm'/>
         <FlatList
            key={'_'}
            nestedScrollEnabled={false}
            onRefresh={loadProducts}
            refreshing={isRefreshing}
            data={filterData(products)}
            keyExtractor={item => item._id}
            numColumns={2}
            initialNumToRender={20}
            renderItem={itemData =>
               <ProductItem
                  images={itemData.item.images}
                  title={itemData.item.title}
                  price={itemData.item.price}
                  onSelect={() => {
                     selectItemHandler(itemData.item._id, itemData.item.title)
                  }}
               >
               </ProductItem>
            }
         />
      </ScrollView>
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
   },
   input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      borderColor: '#888',
      borderRadius: 2
    },
})

export default ProductsOverviewScreen;