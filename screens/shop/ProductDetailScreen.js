import React from 'react';
import {
   View,
   Text,
   Image,
   Button,
   StyleSheet,
   ScrollView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
// import * as cartActions from '../../store/actions/cart';

const ProductDetailScreen = props => {
   // const productId = props.navigation.getParam('productId');
   const productId = props.route.params.productId;
   const selectedProduct = useSelector(state =>
      state.products.listProducts.find(prod => prod._id === productId)
   );
   const dispatch = useDispatch();

   const addDotToNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

   return (
      <ScrollView>
         <Image style={styles.image} source={{ uri: selectedProduct.images[0] }} />
         {/* <View style={styles.actions}>
            <Button color={Colors.primary} title='Add to Cart' onPress={() => {
               dispatch(cartActions.addToCart(selectedProduct))
            }} />
         </View> */}
         <Text style={styles.price}>{addDotToNumber(selectedProduct.price)}.000 VNĐ</Text>
         <Text style={styles.description}>{selectedProduct.description}</Text>
      </ScrollView>
   )
}

export const screenOptions = navData => {
   return {
      headerTitle: navData.route.params.productTitle
   };
}

const styles = StyleSheet.create({
   image: {
      width: '100%',
      height: 300
   },
   actions: {
      marginVertical: 20,
      alignItems: 'center'
   },
   price: {
      fontSize: 20,
      color: '#888',
      textAlign: 'center',
      marginVertical: 20,
      fontFamily: 'open-sans-bold'
   },
   description: {
      fontFamily: 'open-sans',
      fontSize: 14,
      textAlign: 'center',
      marginHorizontal: 20
   }
});

export default ProductDetailScreen;