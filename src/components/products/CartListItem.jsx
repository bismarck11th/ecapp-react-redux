import React from 'react';
// Redux
import { useSelector } from 'react-redux';
import { getUserId } from '../../reducks/users/selectors';
// Firebase
import { db } from '../../firebase/index';
// MUI
import Divider from '@material-ui/core/divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/styles';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles({
  list: {
    height: 128
  },
  image: {
    objectFit: 'cover',
    margin: 16,
    height: 96,
    width: 96
  },
  text: {
    width: '100%'
  }
});

const CartListItem = (props) => {
  const classes = useStyles();
  const selector = useSelector((state) => state);
  
  const cartId = props.product.cartId;
  const image = props.product.images[0].path;
  const name = props.product.name;
  const price = props.product.price.toLocaleString();
  const size = props.product.size;

  const removeProductFromCart = (cartId) => {
    const uid = getUserId(selector);
    return db
      .collection('users')
      .doc(uid)
      .collection('cart')
      .doc(cartId)
      .delete();
  };


  // TODO 商品クリックしたら詳細ページに飛ばす
  return (
    <>
      <ListItem className={classes.list}>
        <ListItemAvatar>
          <img className={classes.image} src={image} alt="商品画像" />
        </ListItemAvatar>
        <div className={classes.text}>
          <ListItemText primary={name} secondary={'サイズ:' + size} />
          <ListItemText primary={'￥' + price} />
        </div>
        <IconButton onClick={() => removeProductFromCart(cartId)}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
      <Divider />
    </>
  );
};

export default CartListItem;
