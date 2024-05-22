import { GET_PRODUCTS_REQUEST, GET_PRODUCTS_DONE, GET_PRODUCT_DETAILS_REQUEST, GET_PRODUCT_DETAILS_DONE, PRODUCT_DONE } from '../actions/types';

const initialState = {
   listProducts: [],
   detailsProduct: null,
   isRefreshing: false
};

export default (state = initialState, action) => {
   switch (action.type) {
      case GET_PRODUCTS_REQUEST:
         return { ...state, isRefreshing: true}
      case GET_PRODUCTS_DONE:
         return { ...state, isRefreshing: false, listProducts: action.payload}
      case GET_PRODUCT_DETAILS_REQUEST:
         return { ...state, isRefreshing: true}
      case GET_PRODUCT_DETAILS_DONE:
         return { ...state, isRefreshing: false, detailsProduct: action.payload}
      case PRODUCT_DONE:
         return { ...state, isRefreshing: false}    
   }
   return state;
}