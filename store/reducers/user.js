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
} from '../actions/types';

const initialState = {
    userData: {},
    cartDetail: [],
    loginSuccess: false,
    token: null,
    didTryAutoLogin: false
};


export default (state = initialState, action) => {
   switch (action.type) {
       case SET_DID_TRY_AL:
           return { ...state, didTryAutoLogin: true}
       case REGISTER_USER:
           return { ...state, register: action.payload }
       case LOGIN_USER:
           return { ...state, loginSuccess: action.payload.loginSuccess, token: action.payload.token}
       case AUTH_USER:
           return { ...state, userData: action.payload }
       case LOGOUT_USER:
           return { ...state, didTryAutoLogin: true, userData: {}, token: null, cartDetail: [] }
       case ADD_TO_CART_USER:
           return {
               ...state, userData: {
                   ...state.userData,
                   cart: action.payload
               }
           }
           
       case GET_CART_ITEMS_USER:
           return {
               ...state, userData: {
                ...state.userData,
                cartDetail: action.payload
            }
           }
       case REMOVE_CART_ITEM_USER:
           return {
               ...state,
               userData: {
                   ...state.userData,
                   cart: action.payload.cart,
                   cartDetail: action.payload.cartDetail,
               }

           }
       case ON_SUCCESS_BUY_USER:
           return {
               ...state,
               userData: {
                   ...state.userData,
                   cart: action.payload.cart,
                   cartDetail: action.payload.cartDetail
               },
           }

       default:
           return state;
   }
}