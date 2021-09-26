import React, { useCallback } from 'react';
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { getProductsInCart } from '../reducks/users/selectors';
// MUI
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui//styles';
// Components
import { CartListItem } from '../components/products/';
import { GrayButton, PrimaryButton } from '../components/UIkit/';

const useStyles = makeStyles({
  root: {
    margin: '0 auto',
    maxWidth: 512,
    width: '100%'
  }
});

const CartList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const productsInCart = getProductsInCart(selector);

  const goToOrder = useCallback(() => {
    dispatch(push('/order/confirm'));
  }, []);

  const backToHome = useCallback(() => {
    dispatch(push('/'));
  }, []);

  return (
    <section className="c-section-wrapin">
      <h2 className="u-text__headline">ショッピングカート</h2>
      {productsInCart.length > 0 ? (
        <List className={classes.root}>
          {productsInCart.map((product) => (
            <CartListItem key={product.cartId} product={product} />
          ))}
        </List>
      ) : (
        <p>カートに商品はありません</p>
      )}
      <div className="module-spacer--medium" />
      <div className="p-grid__column">
        <PrimaryButton label={'レジへ進む'} onClick={goToOrder} />
        <div className="module-spacer--extra-extra-small" />
        <GrayButton label={'ショッピングを続ける'} onClick={backToHome} />
      </div>
    </section>
  );
};

export default CartList;
