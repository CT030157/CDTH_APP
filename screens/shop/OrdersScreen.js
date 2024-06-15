import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import Colors from '../../constants/Colors';
import * as userActions from '../../store/actions/user_actions';

const OrdersScreen = props => {
   const [isLoading, setIsLoading] = useState(false);
   const dispatch = useDispatch();

   const loadOrders = useCallback(async () => {
      try {
         await dispatch(userActions.auth());
      } catch (err) {
         setError(err.message)
      }
   }, [dispatch]);

   useEffect(() => {
      const unsubscribe = props.navigation.addListener('focus', loadOrders)

      return () => {
         unsubscribe();
      };
   }, [loadOrders]);

   useEffect(() => {
      setIsLoading(true);
      loadOrders().then(() => {
         setIsLoading(false);
      });
   }, [dispatch, loadOrders]);
   const orders = useSelector(state => state.user.userData.history);

   if (isLoading) {
      return (
         <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
         </View>
      )
   }

   if (orders.length === 0) {
      return (
         <View style={styles.centered}>
            <Text>Chưa có lịch sử đơn hàng</Text>
         </View>
      )
   }

   return <FlatList
      data={orders}
      keyExtractor={(item, i) => i}
      renderItem={itemData =>
         <OrderItem
            data={itemData.item}
         />
         // <View />
      }
   />
};

export const screenOptions = navData => {
   return {
      headerTitle: 'Lịch sử đơn hàng',
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
      )
   }
}

const styles = StyleSheet.create({
   centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
   }
})

export default OrdersScreen