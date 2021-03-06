import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import classNames from "classnames";
import { List, ListItem, withStyles } from "@material-ui/core";

import footerStyle from "assets/jss/material-kit-react/components/footerStyle.jsx";

function Footer({ ...props }) {
  const { classes, whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a
                href="https://github.com/huynhtehoa"
                className={classes.block}
                target="_blank"
              >
                About us
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href="/"
                className={classes.block}
              >
                Blog
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <Link
                to="/contactus"
                className={classes.block}
              >
                Contact us
              </Link>
            </ListItem>
          </List>
        </div>
        <div className={classes.right}>
          &copy;&nbsp;2019
          <a
            href="https://github.com/huynhtehoa"
            className={aClasses}
            target="_blank"
          >
            &nbsp;Hoa Huynh
          </a>
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  whiteFont: PropTypes.bool
};

export default withStyles(footerStyle)(Footer);
