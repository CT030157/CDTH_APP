import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';

const addDotToNumber = (num) => {
   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const styledStatus = (status) =>{
   switch (status) {
      case 'Chờ duyệt' : {
         return (<View
               style={{
                  borderWidth: 1,
                  borderColor: 'blue',
                  padding: 5,
                  borderRadius: 5,
                  marginHorizontal: 5,
                  backgroundColor: 'blue'
               }}
            >
               <Text style={{ color: 'white', fontWeight: 'bold'}}>Chờ duyệt</Text>
            </View>);
            break;
      }

      case 'Đã duyệt' : {
         return (<View
               style={{
                  borderWidth: 1,
                  borderColor: 'green',
                  padding: 5,
                  borderRadius: 5,
                  marginHorizontal: 5,
                  backgroundColor: 'green'
               }}
            >
               <Text style={{ color: 'white', fontWeight: 'bold'}}>Đã duyệt</Text>
            </View>);
            break;
      }

      case 'Đã hủy' : {
         return (<View
               style={{
                  borderWidth: 1,
                  borderColor: 'red',
                  padding: 5,
                  borderRadius: 5,
                  marginHorizontal: 5,
                  backgroundColor: 'red'
               }}
            >
               <Text style={{ color: 'white', fontWeight: 'bold'}}>Đã hủy</Text>
            </View>);
            break;
      }

      default: {
         return (<View
               style={{
                  borderWidth: 1,
                  borderColor: 'blue',
                  padding: 10,
                  borderRadius: 5,
                  marginHorizontal: 5,
                  backgroundColor: 'blue'
               }}
            >
               <Text style={{ color: 'white', fontWeight: 'bold'}}>Chờ duyệt</Text>
            </View>);
            break;
      }

   }
}

const OrderItem = props => {
   return (
      <View style={styles.cartItem}>
         <View style={styles.itemDetails}>
         <Text style={styles.quantity}>{props.data.quantity}x</Text>
         <Text style={styles.title}>{props.data.name} {props.data.size ? `cỡ ${props.data.size}` : ''}</Text>
         <Text style={styles.price}>{addDotToNumber(props.data.price ?? 0)} VNĐ</Text>
         <Text style={styles.title}>Ngày mua: {moment(props.data.dateOfPurchase).format('DD/mm/yyyy')}</Text>
         <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Text>Trạng thái:</Text>
            {styledStatus(props.data.status)}
            </View>
         </View>
      </View>
   )
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
      fontSize: 16,
      color: '#888',
    },
});

export default OrderItem;