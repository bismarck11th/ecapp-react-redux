import React, { useCallback, useState } from 'react';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import { getIsSignedIn } from '../../reducks/users/selectors';
import { push } from 'connected-react-router';
// MUI
import { makeStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import logo from '../../assets/img/icons/logo.png';
// Components
import { ClosableDrawer, HeaderMenus } from './index';

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  menuBar: {
    backgroundColor: '#fff',
    color: '#444'
  },
  toolBar: {
    margin: '0 auto',
    maxWidth: 1024,
    width: '100%'
  },
  iconButtons: {
    margin: '0 0 0 auto'
  }
});

const Header = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const isSignedIn = getIsSignedIn(selector);

  const [open, setOpen] = useState(false);

  const handleDrawerToggle = useCallback(
    (e) => {
      if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
        return;
      }
      setOpen(!open);
    },
    [open, setOpen]
  );

  return (
    <div classes={classes.root}>
      <AppBar position="fixed" className={classes.menuBar}>
        <Toolbar className={classes.toolBar}>
          <img
            src={logo}
            alt="logo"
            width="128px"
            onClick={() => dispatch(push('/'))}
            role="button"
          />
          {isSignedIn && (
            <div className={classes.iconButtons}>
              <HeaderMenus handleDrawerToggle={handleDrawerToggle} />
            </div>
          )}
        </Toolbar>
      </AppBar>
      <ClosableDrawer open={open} onClose={handleDrawerToggle} />
    </div>
  );
};

export default Header;
