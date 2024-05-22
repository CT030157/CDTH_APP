import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
   ScrollView,
   View,
   KeyboardAvoidingView,
   StyleSheet,
   Button,
   ActivityIndicator,
   Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import * as userActions from '../../store/actions/user_actions';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
   if (action.type === FORM_INPUT_UPDATE) {
      const updatedValues = {
         ...state.inputValues,
         [action.input]: action.value
      };
      const updatedValidities = {
         ...state.inputValidities,
         [action.input]: action.isValid
      };
      let updatedFormIsValid = true;
      for (let key in updatedValidities) {
         updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }
      return {
         formIsValid: updatedFormIsValid,
         inputValidities: updatedValidities,
         inputValues: updatedValues
      };
   }
   return state;
};

const AuthScreen = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState();
   const [isSignup, setIsSignup] = useState(false);
   const dispatch = useDispatch();

   const [formStateLogin, dispatchFormStateLogin] = useReducer(formReducer, {
      inputValues: {
         email: '',
         password: ''
      },
      inputValidities: {
         email: false,
         password: false
      },
      formIsValid: false
   });

   const [formStateSignUp, dispatchFormStateSignUp] = useReducer(formReducer, {
      inputValues: {
         name: '',
         lastname: '',
         email: '',
         password: ''
      },
      inputValidities: {
         name: false,
         lastname: false,
         email: false,
         password: false
      },
      formIsValid: false
   });

   useEffect(() => {
      if (error) {
         Alert.alert('An error occurred', error, [{ text: 'Okay' }]);
      }
   }, [error])

   const authHandler = async () => {
      let action;
      if (isSignup) {
         action = userActions.registerUser(
            {
               name: formStateSignUp.inputValues.name,
               lastname: formStateSignUp.inputValues.lastname,
               email: formStateSignUp.inputValues.email,
               password: formStateSignUp.inputValues.password,
               image: ''
            }
         )
      } else {
         action = userActions.loginUser(
            {
               email: formStateLogin.inputValues.email,
               password: formStateLogin.inputValues.password
            }
         )
      }
      setError(null);
      setIsLoading(true);
      try {
         await dispatch(action);
      } catch (err) {
         setError(err.message);
         setIsLoading(false);
      }
      setIsLoading(false);
   }

   const inputChangeHandlerLogin = useCallback((inputIdentifier, inputValue, inputValidity) => {
      dispatchFormStateLogin({
         type: FORM_INPUT_UPDATE,
         value: inputValue,
         isValid: inputValidity,
         input: inputIdentifier
      });
   }, [dispatchFormStateLogin]);

   const inputChangeHandlerSignUp = useCallback((inputIdentifier, inputValue, inputValidity) => {
      dispatchFormStateSignUp({
         type: FORM_INPUT_UPDATE,
         value: inputValue,
         isValid: inputValidity,
         input: inputIdentifier
      });
   }, [dispatchFormStateSignUp]);

   return (
      <View
         // behavior='padding'
         // keyboardVerticalOffset={1}
         style={styles.screen}
      >
         <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
            <Card style={styles.authContainer}>
               <ScrollView>
                  {isSignup
                  ?
                  <View>
                     <Input
                        id='name'
                        label='Tên'
                        keyboardType='default'
                        required
                        autoCapitalize='none'
                        errorText='Xin vui lòng nhập tên.'
                        onInputChange={inputChangeHandlerSignUp}
                        initialValue=''
                     />
                     <Input
                        id='Họ'
                        label='Họ'
                        keyboardType='default'
                        required
                        autoCapitalize='none'
                        errorText='Xin vui lòng nhập họ.'
                        onInputChange={inputChangeHandlerSignUp}
                        initialValue=''
                     />
                     <Input
                        id='email'
                        label='E-Mail'
                        keyboardType='email-address'
                        required
                        email
                        autoCapitalize='none'
                        errorText='Xin vui lòng nhập email.'
                        onInputChange={inputChangeHandlerSignUp}
                        initialValue=''
                     />
                     <Input
                        id='password'
                        label='Mật khẩu'
                        keyboardType='default'
                        secureTextEntry
                        required
                        minLength={5}
                        autoCapitalize='none'
                        errorText='Xin vui lòng nhập mật khẩu.'
                        onInputChange={inputChangeHandlerSignUp}
                        initialValue=''
                     />
                  </View>
                  :
                  <View>
                     <Input
                        id='email'
                        label='E-Mail'
                        keyboardType='email-address'
                        required
                        email
                        autoCapitalize='none'
                        errorText='Xin vui lòng nhập email.'
                        onInputChange={inputChangeHandlerLogin}
                        initialValue=''
                     />
                     <Input
                        id='password'
                        label='Mật khẩu'
                        keyboardType='default'
                        secureTextEntry
                        required
                        minLength={5}
                        autoCapitalize='none'
                        errorText='Xin vui lòng nhập mật khẩu.'
                        onInputChange={inputChangeHandlerLogin}
                        initialValue=''
                     />
                  </View>
                  }
                  <View style={styles.buttonContainer}>
                     {isLoading ? (
                        <ActivityIndicator
                           size='small'
                           color={Colors.primary}
                        />
                     ) : (
                           <Button
                              title={isSignup ? 'Đăng kí' : 'Đăng nhập'}
                              color={Colors.primary}
                              onPress={authHandler}
                           />
                        )}
                  </View>
                  <View style={styles.buttonContainer}>
                     <Button
                        title={`Đổi sang ${isSignup ? 'Đăng nhập' : 'Đăng kí'}`}
                        color={Colors.accent}
                        onPress={() => {
                           setIsSignup(prevState => !prevState);
                        }}
                     />
                  </View>
               </ScrollView>
            </Card>
         </LinearGradient>
      </View>

   )
};

export const screenOptions = {
   headerTitle: 'Đăng nhập'
}

const styles = StyleSheet.create({
   screen: {
      flex: 1
   },
   gradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
   },
   authContainer: {
      width: '80%',
      maxWidth: 800,
      maxHeight: 800,
      padding: 20
   },
   buttonContainer: {
      marginTop: 10
   }
});

export default AuthScreen;