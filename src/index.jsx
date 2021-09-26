import React from 'react';
import ReactDOM from 'react-dom';
// Redux
import { Provider } from 'react-redux';
import createStore from './reducks/store/store';
// Connect Store and router
import { ConnectedRouter } from 'connected-react-router';
import * as History from 'history';
// MUI
import { MuiThemeProvider } from '@material-ui/core';
import { theme } from './assets/theme';
// Component
import App from './App';
import reportWebVitals from './reportWebVitals';

const history = History.createBrowserHistory();
// store作成
export const store = createStore(history);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
