import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Typography, Drawer, Container } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

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
  },
  random: theme.mixins.toolbar
}));

export default function NavigationBar(props) {
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
        </Toolbar>
      </AppBar>
    </div>
  );
}
