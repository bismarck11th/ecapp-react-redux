import React, { useEffect } from 'react';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersHistory } from '../reducks/users/operations';
import { getOrdersHistory } from '../reducks/users/selectors';
// MUI
import { makeStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
// Components
import { OrderHistoryItem } from '../components/products/';

const useStyles = makeStyles((theme) => ({
  orderList: {
    background: theme.palette.gray['100'],
    margin: '0 auto',
    padding: 32,
    [theme.breakpoints.down('md')]: {
      width: '100%'
    },
    [theme.breakpoints.up('md')]: {
      width: 768
    }
  }
}));

const OrderHistory = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const orders = getOrdersHistory(selector);

  useEffect(() => {
    dispatch(fetchOrdersHistory());
  }, []);

  return (
    <section className="c-section-wrapin">
      <List className={classes.orderList}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderHistoryItem key={order.id} order={order} />
          ))
        ) : (
          <p>注文履歴はありません。</p>
        )}
      </List>
    </section>
  );
};

export default OrderHistory;
