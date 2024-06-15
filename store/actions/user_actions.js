import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART_USER,
    GET_CART_ITEMS_USER,
    REMOVE_CART_ITEM_USER,
    ON_SUCCESS_BUY_USER,
    SET_DID_TRY_AL
} from './types';
import { createAppClient } from '../../networking'
import {
    Alert
 } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const setDidTryAL = () => {
    return { type: SET_DID_TRY_AL };
 }

export const registerUser = (dataToSubmit) => {
    return async (dispatch) => {
        try {
            const appClient = createAppClient('https://cdth-web.vercel.app/api/', 15000);
            const res = await appClient.post('/users/register', dataToSubmit);
            if (res.success){
                dispatch(loginUser({email: dataToSubmit.email, password: dataToSubmit.password}))
            } else {
                Alert.alert('Lỗi', 'Lỗi', [{ text: 'Okay' }])
            }
        } catch (error) {
            console.error(error);
        }
    }
}


export const loginUser = (dataToSubmit) => {
    return async (dispatch, getState) => {
        try {
            const { token } = getState().user;
            const appClient = createAppClient('https://cdth-web.vercel.app/api/', 15000, token);
            const res = await appClient.post('/users/login', dataToSubmit);
            if (res.loginSuccess){
                await AsyncStorage.setItem('userData', JSON.stringify(res));
                dispatch({
                    type: LOGIN_USER,
                    payload: res
                })
                dispatch(auth());
            } else {
                Alert.alert('', res.message, [{ text: 'Okay' }])
            }
        } catch (error) {
            console.error(error);
        }
    }
}


export function auth() {
    return async (dispatch, getState) => {
        try {
            const { token } = getState().user;
            const appClient = createAppClient('https://cdth-web.vercel.app/api/', 15000, token);
            const res = await appClient.get('/users/auth');
            dispatch({
                type: AUTH_USER,
                payload: res
            })
        } catch (error) {
            console.error(error);
        }
    }
}

export function logoutUser() {
    return async (dispatch, getState) => {
        try {
            const { token } = getState().user;
            const appClient = createAppClient('https://cdth-web.vercel.app/api/', 15000, token);
            const res = await appClient.get('/users/logout');
            await AsyncStorage.clear();
            dispatch({
                type: LOGOUT_USER,
            })
        } catch (error) {
            console.error(error);
        }
    }
}


export const autoLoginUser = (res) => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: LOGIN_USER,
                payload: res
            })
            dispatch(auth());
        } catch (error) {
            console.error(error);
        }
    }
}

export function addToCart(_id, quantity, size) {
    return async (dispatch, getState) => {
        try {
            const { token } = getState().user;
            const appClient = createAppClient('https://cdth-web.vercel.app/api/', 15000, token);
            const res = await appClient.get(`/users/addToCart?productId=${_id}&quantity=${quantity}&size=${size}`);
            dispatch({
                type: ADD_TO_CART_USER,
                payload: res
            })
        } catch (error) {
            console.error(error);
        }
    }
}





export function getCartItems(cartItems, userCart) {
    return async (dispatch, getState) => {
        try {
            const { token } = getState().user;
            const appClient = createAppClient('https://cdth-web.vercel.app/api/', 15000, token);
            let res = await appClient.get(`/products/products_by_id?id=${cartItems}&type=array`);
            userCart.forEach(cartItem => {
                res.forEach((productDetail, i) => {
                    if (cartItem.product_id === productDetail._id) {
                        cartItem.title = productDetail.title;
                        cartItem.images = productDetail.images;
                        cartItem.price = productDetail.price;
                    }
                })
            })
            dispatch({
                type: GET_CART_ITEMS_USER,
                payload: userCart
            })
        } catch (error) {
            console.error(error);
        }
    }
}




export function removeCartItem(id) {
    return async (dispatch, getState) => {
        try {
            const { token } = getState().user;
            const appClient = createAppClient('https://cdth-web.vercel.app/api/', 15000, token);
            let res = await appClient.get(`/users/removeFromCart?_id=${id}`).then(response => {
                response.cart.forEach(item => {
                    response.cartDetail.forEach((k, i) => {
                        if (item.id === k._id) {
                            response.cartDetail[i].quantity = item.quantity
                        }
                    })
                })
                return response
            });
            dispatch({
                type: REMOVE_CART_ITEM_USER,
                payload: res
            })
        } catch (error) {
            console.error(error);
        }
    }
}


export function onSuccessBuy(data) {
    return async (dispatch, getState) => {
        try {
            const { token } = getState().user;
            const appClient = createAppClient('https://cdth-web.vercel.app/api/', 15000, token);
            let res = await appClient.post(`/users/successBuy`, data);
            dispatch({
                type: ON_SUCCESS_BUY_USER,
                payload: res
            })
        } catch (error) {
            console.error(error);
        }
    }
}





