import React from 'react';
import {
   View,
   Text,
   Image,
   StyleSheet,
   Button,
   TouchableOpacity,
   TouchableNativeFeedback,
   Platform,
   Dimensions
} from 'react-native';

import Carousel from 'react-native-snap-carousel';

import Card from '../UI/Card';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const wp = (percentage) => {
   const value = (percentage * viewportWidth) / 100;
   return Math.round(value);
}
const slideWidth = wp(100);
const itemHorizontalMargin = wp(1);

const sliderWidth = viewportWidth / 2;
const itemWidth = (slideWidth + itemHorizontalMargin * 2) / 2;

const ProductItem = props => {

   let TouchableCmp = TouchableOpacity;

   if (Platform.OS === 'android' && Platform.Version >= 21) {
      TouchableCmp = TouchableNativeFeedback;
   }

   const addDotToNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
   }

   const renderItem = ({item, index}) => {
      return (
         <Image style={styles.image} source={{ uri: item }} />
      );
  }

   return (
      <Card style={styles.product}>
         <View style={styles.touchable}>
            <TouchableCmp onPress={props.onSelect} useForeground >
               <View>
                  <View style={styles.imageContainer}>
                  <Carousel
                     // ref={(c) => { this._carousel = c; }}
                     data={props.images}
                     renderItem={renderItem}
                     sliderWidth={sliderWidth}
                     itemWidth={itemWidth}
                     loop={true}
                     inactiveSlideScale={0.94}
                     inactiveSlideOpacity={0.7}
                     loopClonesPerSide={2}
                     autoplay={true}
                     autoplayDelay={500}
                     autoplayInterval={3000}
                     />
                  </View>
                  <View style={styles.details}>
                     <Text style={styles.title}>{props.title}</Text>
                     <Text style={styles.price}>{addDotToNumber(props.price ?? 0)} VNĐ</Text>
                  </View>
                  <View style={styles.actions}>
                     {props.children}
                  </View>
               </View>
            </TouchableCmp>
         </View>
      </Card >
   )
};


const styles = StyleSheet.create({
   product: {      
      height: 350,
      margin: 5,
      flex: 1/2
   },
   touchable: {
      borderRadius: 10,
      overflow: 'hidden'
   },
   imageContainer: {
      width: '100%',
      height: '65%',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      overflow: 'hidden'
   },
   image: {
      width: '100%',
      height: '100%'
   },
   details: {
      alignItems: 'baseline',
      height: '17%',
      padding: 10
   },
   title: {
      fontFamily: 'open-sans-bold',
      fontSize: 15,
      marginVertical: 2
   },
   price: {
      fontFamily: 'open-sans',
      fontSize: 14,
      color: '#888',
      marginTop: 5,
      paddingBottom: 5
   },
   actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '23%',
      padding: 20
   }
});

export default ProductItem;