import React from 'react';
// Router
import Router from './Router';
// CSS
import './assets/reset.css';
import './assets/style.css';
// Components
import { Header } from './components/header/';

const App = () => {
  return (
    <>
      <Header />
      <main className="c-main">
        <Router />
      </main>
    </>
  );
};

export default App;
