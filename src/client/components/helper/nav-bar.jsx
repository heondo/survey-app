import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import styled from 'styled-components';

const useStyles = makeStyles(theme => ({
  toolbar: {
    backgroundColor: 'lightgrey'
  },
  title: {
    flexGrow: 1
  },
  homeLink: {
    textDecoration: 'none',
    color: 'black'
  }
}));

export default function NavigationBar(props) {
  const { logout } = props;
  const classes = useStyles();

  return (
    <div>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <IconButton edge="start">
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title}>
            <Link className={classes.homeLink} to="/" >Surveyor</Link>
          </Typography>
          <LogoutButton>
            <Link
              to="/"
              className={classes.homeLink}
              onClick={logout}
            >
              <Typography>
                LOG OUT
              </Typography>
            </Link>
          </LogoutButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}

const LogoutButton = styled.div`
  float: right:
`;
