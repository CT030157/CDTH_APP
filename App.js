import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import ReduxThunk from 'redux-thunk';

import productReducer from './store/reducers/products';
import userReducer from './store/reducers/user';
import AppNavigator from './navigation/AppNavigator';

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
  })
};

const rootReducer = combineReducers({
  products: productReducer,
  user: userReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  if (!fontLoaded) {
    return <AppLoading 
      startAsync={fetchFonts} 
      onFinish={() => {
        setFontLoaded(true);
      }} 
      onError={(err) => console.log(err)}
    />
  }
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};