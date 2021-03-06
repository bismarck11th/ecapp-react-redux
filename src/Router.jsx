import React from 'react';
import { Route, Switch } from 'react-router';
import Auth from './Auth';
import {
  CartList,
  OrderConfirm,
  OrderComplete,
  OrderHistory,
  ProductDetail,
  ProductEdit,
  ProductList,
  Reset,
  SignIn,
  SignUp
} from './templates/';

const Router = () => {
  return (
    <Switch>
      <Route exact path={'/signup'} component={SignUp} />
      <Route exact path={'/signin'} component={SignIn} />
      <Route exact path={'/signin/reset'} component={Reset} />

      <Auth>
        <Route exact path={'(/)?'} component={ProductList} />
        <Route exact path={'/product/:id'} component={ProductDetail} />
        <Route path={'/product/edit(/:id)?'} component={ProductEdit} />

        <Route exact path={'/cart'} component={CartList} />
        <Route exact path={'/order/confirm'} component={OrderConfirm} />
        <Route exact path={'/order/complete'} component={OrderComplete} />
        <Route exact path={'/order/history'} component={OrderHistory} />
      </Auth>
    </Switch>
  );
};

export default Router;
