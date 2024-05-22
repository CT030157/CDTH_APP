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

// export function registerUser(dataToSubmit) {
//     const request = axios.post(`${USER_SERVER}/register`, dataToSubmit)
//         .then(response => response.data);

//     return {
//         type: REGISTER_USER,
//         payload: request
//     }
// }


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

// export function addToCart(_id) {
//     const request = axios.get(`${USER_SERVER}/addToCart?productId=${_id}`)
//         .then(response => response.data);

//     return {
//         type: ADD_TO_CART_USER,
//         payload: request
//     }
// }





// export function getCartItems(cartItems, userCart) {
//     const request = axios.get(`${PRODUCT_SERVER}/products_by_id?id=${cartItems}&type=array`)
//         .then(response => {
//             userCart.forEach(cartItem => {
//                 response.data.forEach((productDetail, i) => {
//                     if (cartItem.id === productDetail._id) {
//                         response.data[i].quantity = cartItem.quantity;
//                     }
//                 })
//             })

//             return response.data;
//         });

//     return {
//         type: GET_CART_ITEMS_USER,
//         payload: request
//     }
// }




// export function removeCartItem(id) {
//     const request = axios.get(`/api/users/removeFromCart?_id=${id}`)
//         .then(response => {

//             response.data.cart.forEach(item => {
//                 response.data.cartDetail.forEach((k, i) => {
//                     if (item.id === k._id) {
//                         response.data.cartDetail[i].quantity = item.quantity
//                     }
//                 })
//             })
//             return response.data;
//         });

//     return {
//         type: REMOVE_CART_ITEM_USER,
//         payload: request
//     }
// }


// export function onSuccessBuy(data) {

//     const request = axios.post(`${USER_SERVER}/successBuy`, data)
//         .then(response => response.data);

//     return {
//         type: ON_SUCCESS_BUY_USER,
//         payload: request
//     }
// }





