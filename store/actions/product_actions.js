import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_DONE,
    GET_PRODUCT_DETAILS_REQUEST,
    GET_PRODUCT_DETAILS_DONE,
    PRODUCT_DONE
} from './types';
import { createAppClient } from '../../networking'
import {
    Alert
 } from 'react-native';


export const getProducts = (filter = {}) => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: GET_PRODUCTS_REQUEST,
            })
            const { token } = getState().user;
            const appClient = createAppClient('https://cdth-web.vercel.app/api/', 15000, token);
            const res = await appClient.post('/products/getProducts', filter);
            if (res.success){
                dispatch({
                    type: GET_PRODUCTS_DONE,
                    payload: res.products
                })
            } else {
                dispatch({
                    type: PRODUCT_DONE,
                })
            }
        } catch (error) {
            console.error(error);
        }
    }
}