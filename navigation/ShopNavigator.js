import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { Platform, SafeAreaView, Button, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import ProductsOverviewScreen, { screenOptions as productOverviewScreenOptions } from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen, { screenOptions as productDetailScreenOptions } from '../screens/shop/ProductDetailScreen';
import AuthScreen, { screenOptions as authScreenOptions } from '../screens/user/AuthScreen';
import Colors from '../constants/Colors';
import * as userActions from '../store/actions/user_actions';

const defaultNavOptions = {
   headerStyle: {
      backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
   },
   headerTitleStyle: {
      fontFamily: 'open-sans-bold'
   },
   headerBackTitleStyle: {
      fontFamily: 'open-sans'
   },
   headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
}

const ProductsStackNavigator = createStackNavigator();

const ProductsNavigator = () => {
   return <ProductsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProductsStackNavigator.Screen 
         name='ProductsOverview' 
         component={ProductsOverviewScreen}
         options={productOverviewScreenOptions} 
      />
      <ProductsStackNavigator.Screen 
         name='ProductDetail' 
         component={ProductDetailScreen} 
         options={productDetailScreenOptions}
      />
   </ProductsStackNavigator.Navigator>
}

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = () => {   
   const dispatch = useDispatch();

   return <ShopDrawerNavigator.Navigator 
      drawerContent={props => {
         return (
            <View style={{ flex: 1, paddingTop: 20 }}>
               <SafeAreaView forceIncet={{ top: 'always', horizontal: 'never' }}>
                  <DrawerItemList {...props} />
                  <Button title='Đăng xuất' color={'#ff7875'} onPress={() => {
                     dispatch(userActions.logoutUser());
                  }} />
               </SafeAreaView>
            </View>
         )
      }} 
      drawerContentOptions={{
         activeTintColor: Colors.primary
      }}
   >
      <ShopDrawerNavigator.Screen
         name='Trang chủ'
         component={ProductsNavigator}
         options={{
            drawerIcon: props => (
               <Ionicons
                  name={Platform.OS === 'android' ? 'mcart' : 'ios-cart'}
                  size={23}
                  color={props.color}
               />
            )
         }}
      />
   </ShopDrawerNavigator.Navigator>
}

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
   return <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AuthStackNavigator.Screen
         name='Auth'
         component={AuthScreen}
         options={authScreenOptions} 
      />
   </AuthStackNavigator.Navigator>
} 
