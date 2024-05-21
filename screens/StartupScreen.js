import React, { useEffect } from 'react';
import {
   View,
   ActivityIndicator,
   StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

import Colors from '../constants/Colors';
import * as userActions from '../store/actions/user_actions'

const StartupScreen = () => {
   const dispatch = useDispatch();
   useEffect(() => {
      const tryLogin = async () => {
         const userData = await AsyncStorage.getItem('userData');
         if (!userData) {
            dispatch(userActions.setDidTryAL());
            return;
         }
         const transformedData = JSON.parse(userData);
         const { token, userId, tokenExp } = transformedData;
         const expirationDate = new Date(tokenExp);

         if (expirationDate <= new Date() || !token || !userId) {
            dispatch(userActions.setDidTryAL());
            return;
         }

         const expirationTime = expirationDate.getTime() - new Date().getTime();

         // dispatch(userActions.authenticate(userId, token, expirationTime));
      };

      tryLogin()
   }, [dispatch]);

   return (
      <View style={styles.screen}>
         <ActivityIndicator size='large' color={Colors.primary} />
      </View>
   )
};

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
   }
});

export default StartupScreen;
