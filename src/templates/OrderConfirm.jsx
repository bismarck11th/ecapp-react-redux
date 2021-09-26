import React, { useCallback, useMemo } from 'react';
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { getProductsInCart } from '../reducks/users/selectors';
import { orderProduct } from '../reducks/products/operations';
// MUI
import { makeStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
// Components
import { CartListItem } from '../components/products';
import { PrimaryButton, TextDetail } from '../components/UIkit/';

const useStyles = makeStyles((theme) => ({
  detailBox: {
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      width: 320
    },
    [theme.breakpoints.up('sm')]: {
      width: 512
    }
  },
  orderBox: {
    border: '1px solid rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    boxShadow: '0 2px 2px 2px rgba(0, 0, 0, 0.2)',
    height: 256,
    width: 288,
    margin: '24px auto 16px auto',
    padding: 16
  }
}));

const OrderConfirm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const productsInCart = getProductsInCart(selector);

  // 商品合計
  const subTotal = useMemo(() => {
    // 0: initial value
    return productsInCart.reduce((sum, product) => (sum += product.price), 0);
  }, [productsInCart]);

  // 送料
  const shippingFee = subTotal >= 10000 ? 0 : 210;

  // 消費税
  const tax = subTotal * 0.1;

  //　合計
  const total = subTotal + shippingFee + tax;

  const order = useCallback(() => {
    dispatch(orderProduct(productsInCart, total));
  }, [productsInCart, total]);

  // TODO 商品合計が一万円未満だった場合、１万円以上で送料無料になるように伝える
  return (
    <section className="c-section-wrapin">
      <h2 className="u-text__headline">注文確認</h2>
      <div className="p-grid__row">
        <div className={classes.detailBox}>
          <List>
            {productsInCart.length > 0 &&
              productsInCart.map((product) => (
                <CartListItem key={product.cartId} product={product} />
              ))}
          </List>
        </div>
        <div className={classes.orderBox}>
          <TextDetail label={'商品合計'} value={subTotal.toLocaleString()} />
          <TextDetail label={'消費税'} value={tax} />
          <TextDetail label={'送料'} value={shippingFee.toLocaleString()} />
          <Divider />
          <div className="module-spacer--extra-small" />
          <TextDetail label={'合計（税込）'} value={total.toLocaleString()} />
          <PrimaryButton label={'注文する'} onClick={order} />
        </div>
      </div>
    </section>
  );
};

export default OrderConfirm;
