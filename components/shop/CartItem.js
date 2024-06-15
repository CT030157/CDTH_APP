import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

const addDotToNumber = (num) => {
   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const CartItem = props => {
  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: props.image}} style={styles.image} />
      <View style={styles.itemDetails}>
        <Text style={styles.quantity}>{props.quantity}x</Text>
        <Text style={styles.title}>{props.title} {props.size ? `cỡ ${props.size}` : ''}</Text>
        <Text style={styles.price}>{addDotToNumber(props.price ? props.price : 0)} VNĐ</Text>
      </View>
      {props.deletable && (
        <TouchableOpacity
            key={'+'}
            style={{
               borderWidth: 1,
               borderColor: 'red',
               padding: 5,
               borderRadius: 5,
               marginHorizontal: 5,
               backgroundColor: 'red',
               marginLeft: 20
            }}
            onPress={props.onRemove}
         >
            <Text style={{ color: 'white', fontSize: 20 }}>X</Text>
         </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  itemDetails: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
    paddingLeft: 10
  },
  image: {
    width: 50,
    height: 50,
    backgroundColor: '#ccc'
  },
  quantity: {
    fontFamily: 'open-sans',
    color: '#888',
    fontSize: 16
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 16
  },
  price: {
    fontFamily: 'open-sans',
    fontSize: 16
  },
});

export default CartItem;