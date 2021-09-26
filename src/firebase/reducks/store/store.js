import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware
} from 'redux';
// Reducers
import { ProductsReducer } from '../products/reducers';
import { UsersReducer } from '../users/reducers';
// Middleware
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';

export default function createStore(history) {
  return reduxCreateStore(
    combineReducers({
      products: ProductsReducer,
      router: connectRouter(history),
      users: UsersReducer
    }),
    applyMiddleware(routerMiddleware(history), thunk)
  );
}
