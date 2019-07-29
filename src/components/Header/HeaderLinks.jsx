import React from "react";
import { Link } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";

import { Home, Explore, AccountCircle, Backup, Input, PersonPin, LibraryAdd, FavoriteBorder, LockOpen } from "@material-ui/icons";

import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import Button from "components/CustomButtons/Button.jsx";

import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle.jsx";

import 'assets/css/custom-style.css'

function HeaderLinks({ ...props }) {
  const { classes, isLogin, clearToken, token, name } = props;
  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Tooltip
          id="home"
          title="Go to homepage"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Link
            to={"/"}
            className={classes.navLink}
            style={{ padding: 0 }}
          >
            <Button
              color="transparent"
            >
              <Home className={classes.icons} /> Home
            </Button>
          </Link>
        </Tooltip>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip
          id="dicover"
          title="Discover all healthy food recipes"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Link
            to={"/discover"}
            className={classes.navLink}
            style={{ padding: 0 }}
          >
            <Button
              color="transparent"
            >
              <Explore className={classes.icons} /> Discover
            </Button>
          </Link>
        </Tooltip>
      </ListItem>
      {!isLogin ?
        <>
          <ListItem className={classes.listItem}>
            <Tooltip
              id="register"
              title="Join the community now"
              placement={window.innerWidth > 959 ? "top" : "left"}
              classes={{ tooltip: classes.tooltip }}
            >
              <Link
                to={"/register-page"}
                className={classes.navLink}
                style={{ padding: 0 }}
              >
                <Button
                  color="transparent"
                >
                  <Backup className={classes.icons} /> Register
            </Button>
              </Link>
            </Tooltip>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Tooltip
              id="login"
              title="Get started"
              placement={window.innerWidth > 959 ? "top" : "left"}
              classes={{ tooltip: classes.tooltip }}
            >
              <Link
                to={"/login-page"}
                className={classes.navLink}
                style={{ padding: 0 }}
              >
                <Button
                  color="transparent"
                >
                  <AccountCircle className={classes.icons} /> Log In
                </Button>
              </Link>
            </Tooltip>
          </ListItem>
        </>
        :
        <>
          <ListItem className={classes.listItem}>
            <Tooltip
              id="addmore"
              title="Add you favorite recipes now"
              placement={window.innerWidth > 959 ? "top" : "left"}
              classes={{ tooltip: classes.tooltip }}
            >
              <Link
                to={"/addmore"}
                className={classes.navLink}
                style={{ padding: 0 }}
              >
                <Button
                  color="transparent"
                >
                  <LibraryAdd className={classes.icons} /> Add More
            </Button>
              </Link>
            </Tooltip>
          </ListItem>
          <ListItem className={classes.listItem} style={{ marginLeft: 15 }}>
            <CustomDropdown
              noLiPadding
              buttonText={name}
              buttonProps={{
                className: classes.navLink,
                color: "transparent"
              }}
              buttonIcon={PersonPin}
              dropdownList={[
                <Link
                  to={{
                    pathname: "/favorite",
                    clearToken,
                    state: {
                      isLogin,
                      name,
                      token,
                    }
                  }}
                  className={classes.dropdownLink}
                  style={{ padding: 0 }}
                >
                  <Button
                    color="transparent"
                  >
                    <FavoriteBorder className={classes.icons} /> Favorite List
                    </Button>
                </Link>,
                <Link
                to={{
                  pathname: "/change-pw",
                  clearToken,
                  state: {
                    isLogin,
                    name,
                    token,
                  }
                }}
                className={classes.dropdownLink}
                style={{ padding: 0 }}
              >
                <Button
                  color="transparent"
                >
                  <LockOpen className={classes.icons} /> Change Password
                  </Button>
              </Link>,
                <Link
                  to={"/login-page"}
                  className={classes.dropdownLink}
                  style={{ padding: 0 }}
                >
                  <Button
                    color="transparent"
                    onClick={clearToken}
                  >
                    <Input className={classes.icons} /> Logout
                          </Button>
                </Link>
              ]}
            />
          </ListItem>
          <ListItem className={classes.listItem}>

          </ListItem>
        </>
      }
    </List>
  );
}

export default withStyles(headerLinksStyle)(HeaderLinks);
