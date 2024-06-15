import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import Card from '../../components/UI/Card';
import * as userActions from '../../store/actions/user_actions';

const CartScreen = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [Total, setTotal] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)
    const [ShowSuccess, setShowSuccess] = useState(false)
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')

    const user = useSelector(state => state.user);

    const dispatch = useDispatch();

    useEffect(() => {
        setIsRefreshing(true);
        let cartItems = [];
            if (user.userData && user.userData.cart) {
                if (user.userData.cart.length > 0) {
                    user.userData.cart.forEach(item => {
                        cartItems.push(item.product_id)
                    });
                    dispatch(userActions.getCartItems(cartItems, user.userData.cart))
                        .then(() => {
                            if (user.userData.cartDetail && user.userData.cartDetail.length > 0) {
                                calculateTotal(user.userData.cartDetail)
                            }
                        })
                }
            }
        setIsRefreshing(false);
    }, [dispatch, user.userData]);

    if (isRefreshing) {
        return (
           <View style={styles.centered}>
              <ActivityIndicator size='large' color={Colors.primary} />
           </View>
        )
     }

    const calculateTotal = (cartDetail) => {
        let total = 0;
        let totalUSD = 0;
        cartDetail.map(item => {
            total += parseInt(item.price, 10) * item.quantity;
            totalUSD = Number.parseFloat(totalUSD =total/22).toFixed(2)
        });
        setTotal(total)
        setShowTotal(true)
    }
   const sendOrderHandler = async () => {
      setIsLoading(true)
      await dispatch(userActions.onSuccessBuy({
        cartDetail: user.userData.cartDetail,
        paymentData: 'ok',
        phone: phone,
        address: address,
    }));
      setIsLoading(false)
   }

    const removeItemHandler = async (id) => {
        setIsLoading(true)
        await dispatch(userActions.removeCartItem(id));
        if (user.userData.cart.length <= 0) {
            setShowTotal(false)
        } else {
            calculateTotal(user.userData.cartDetail)
        }
        setIsLoading(false)
    }
    const addDotToNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

   return (
      <View style={styles.screen}>
        {isRefreshing ? (
               <ActivityIndicator size='small' color={Colors.primary} />
            ) : ( <View />)}
        {user.userData.cart.length == 0 ? (
               <Card style={styles.summary}>
               <Text style={styles.summaryText}>
                  Chưa có sản phẩm trong giỏ hàng
               </Text>
            </Card>
            ) : (<FlatList
            data={user.userData.cartDetail}
            keyExtractor={item => item.id}
            extraData={user.userData}
            renderItem={itemData => (
               <CartItem
                  quantity={itemData.item.quantity}
                  title={itemData.item.title}
                  price={itemData.item.price}
                  image={itemData.item.images[0]}
                  deletable
                  onRemove={() => {removeItemHandler(itemData.item.id)}}
               />
            )}
         />)}
        {ShowTotal && user.userData.cart.length != 0
        ?
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <Text>Số điện thoại:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setPhone}
                    value={phone}
                    keyboardType='numeric'
                    placeholder='Vui lòng nhập số điện thoại'/>
                </View>
             <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <Text>Địa chỉ:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setAddress}
                    value={address}
                    placeholder='Vui lòng nhập địa chỉ'/>
                </View>
            <Card style={styles.summary}>
                <Text style={styles.summaryText}>
                Tổng tiền: <Text style={styles.amount}>{addDotToNumber(Total ?? 0)} VNĐ</Text>
                </Text>
                {isLoading ? (
                <ActivityIndicator size='small' color={Colors.primary} />
                ) : (
                    <Button
                        color={Colors.accent}
                        title='Thanh toán'
                        disabled={user.userData.cartDetail.length === 0 || (phone.trim() === '' && address.trim() === '')}
                        onPress={sendOrderHandler}
                    />
                )
                }
            </Card>
         </View>
         :
         <View />}
      </View>
   )
};

export const screenOptions  = {
   headerTitle: 'Giỏ hàng'
}

const styles = StyleSheet.create({
   screen: {
      margin: 20
   },
   summary: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
      padding: 10,
      marginTop: 20,
   },
   summaryText: {
      fontFamily: 'open-sans-bold',
      fontSize: 18
   },
   amount: {
      color: Colors.primary
   },
   input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: '#888',
    borderRadius: 2,
    flex: 1,
    backgroundColor: 'white'
  },
});

export default CartScreen;