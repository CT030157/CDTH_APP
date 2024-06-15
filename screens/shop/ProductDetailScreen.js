import React, {useState} from 'react';
import {
   View,
   Text,
   Image,
   TouchableOpacity,
   StyleSheet,
   ScrollView,
   Dimensions,
   Button,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import Colors from '../../constants/Colors';
import * as userActions from '../../store/actions/user_actions';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const wp = (percentage) => {
   const value = (percentage * viewportWidth) / 100;
   return Math.round(value);
}
const slideWidth = wp(50);
const itemHorizontalMargin = wp(4);

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2.5;

const ProductDetailScreen = props => {
   const [size, setSize] = useState('S');
   const [quantity, setQuantity] = useState(1);

   const productId = props.route.params.productId;
   const selectedProduct = useSelector(state =>
      state.products.listProducts.find(prod => prod._id === productId)
   );
   const dispatch = useDispatch();

   const addDotToNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
   }

   const renderItem = ({item, index}) => {
      return (
         <Image style={styles.image} source={{ uri: item }} />
      );
   }

   const addToCartHandler = () => {
      dispatch(userActions.addToCart(productId, quantity, size));
   }

   return (
      <ScrollView style={styles.container}>
         <Text style={styles.title}>{selectedProduct.title}</Text>
         <Carousel
            data={selectedProduct.images}
            renderItem={renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            loop={true}
            autoplay={true}
            autoplayDelay={500}
            autoplayInterval={3000}
            />
         <Text style={styles.price}>{addDotToNumber(selectedProduct.price ?? 0)} VNĐ</Text>
         <Text style={styles.description}>{selectedProduct.description}</Text>
         <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: 10 }}>
            {['S', 'M', 'L', 'XL', 'XXL'].map((value) => (
               <TouchableOpacity
                  key={value}
                  style={{
                     borderWidth: 1,
                     borderColor: size == value ? 'blue' : '#d9d9d9',
                     padding: 10,
                     borderRadius: 5,
                     marginHorizontal: 5,
                     backgroundColor: size == value ? 'blue' : 'white'
                  }}
                  onPress={() => {setSize(value)}}
               >
                  <Text style={{ color: size != value ? 'black' : 'white' }}>{value}</Text>
               </TouchableOpacity>
            ))}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
               <TouchableOpacity
                  key={'-'}
                  style={{
                     borderWidth: 1,
                     borderColor: 'red',
                     padding: 10,
                     borderRadius: 5,
                     marginHorizontal: 5,
                     backgroundColor: 'white'
                  }}
                  onPress={() => {setQuantity(quantity-1)}}
               >
                  <Text style={{ color: 'black', fontSize: 20 }}>-</Text>
               </TouchableOpacity>

               <Text style={styles.input}>{quantity}</Text>
               <TouchableOpacity
                  key={'+'}
                  style={{
                     borderWidth: 1,
                     borderColor: 'red',
                     padding: 10,
                     borderRadius: 5,
                     marginHorizontal: 5,
                     backgroundColor: 'white'
                  }}
                  onPress={() => {setQuantity(quantity+1)}}
               >
                  <Text style={{ color: 'black', fontSize: 20 }}>+</Text>
               </TouchableOpacity>
            </View>

         <View style={styles.actions}>
            <Button color={Colors.primary} title='Thêm vào giỏ hàng' 
            onPress={() => {addToCartHandler()}} />
         </View>
         <View style={{height: 50}}/>
      </ScrollView>
   )
}

export const screenOptions = navData => {
   return {
      headerTitle: 'Chi tiết sản phẩm'
   };
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   image: {
      width: '100%',
      height: 400,
      resizeMode: 'contain'
   },
   actions: {
      marginVertical: 10,
      alignItems: 'center'
   },
   title: {
      fontSize: 20,
      textAlign: 'center',
      marginVertical: 20,
      fontFamily: 'open-sans-bold'
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
      textAlign: 'left',
      marginHorizontal: 20
   },
   input: {
      margin: 12,
      borderWidth: 1,
      padding: 10,
      borderColor: '#888',
      borderRadius: 2,
      fontSize: 20,
      textAlign: 'center'
    },
});

export default ProductDetailScreen;