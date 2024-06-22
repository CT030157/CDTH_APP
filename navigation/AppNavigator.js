import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import { ShopNavigator, AuthNavigator } from './ShopNavigator';
// import { AuthNavigator } from './ShopNavigator';
import StartupScreen from '../screens/StartupScreen';

const AppNavigator = () => {
   const userId = useSelector(state => !!state.user.userData._id);
   const isAuth = useSelector(state => !!state.user.token);
   const didTryAutoLogin = useSelector(state => state.user.didTryAutoLogin);

   return <NavigationContainer>
      {isAuth && userId && <ShopNavigator />}
      {!isAuth && !userId &&didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <StartupScreen />}
   </NavigationContainer>
}

export default AppNavigator;