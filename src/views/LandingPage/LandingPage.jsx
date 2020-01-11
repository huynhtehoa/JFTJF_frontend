import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";

import Header from "components/Header/Header.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import BodyContent from "./BodyContent";
import Footer from "components/Footer/Footer.jsx";

import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";

const dashboardRoutes = [];

const LandingPage = ({
  isLogin,
  clearToken,
  name,
  token,
  isAdmin,
  classes,
  ...rest
}) => {
  const [inputSearch, setInputSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  useEffect(() => {
    setIsSearched(false);
  }, [isSearched]);

  const search = async () => {
    let url = "https://jftjf-backend.herokuapp.com/search";
    let data = {
      inputSearch
    };
    let response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });
    let jsonData = await response.json();

    setSearchData(jsonData.results);
    setIsSearched(true);
  };

  return isSearched ? (
    <Redirect
      to={{
        pathname: `/replacement/${inputSearch}`,
        clearToken: clearToken,
        state: {
          searchData,
          name,
          isLogin,
          token,
          inputSearch,
          isAdmin
        }
      }}
    />
  ) : (
    <div>
      <Header
        color="transparent"
        routes={dashboardRoutes}
        brand="Joy Foods"
        rightLinks={
          <HeaderLinks
            clearToken={clearToken}
            isLogin={isLogin}
            name={name}
            token={token}
          />
        }
        fixed
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
      <BodyContent
        classes={classes}
        setInputSearch={setInputSearch}
        search={search}
      />
      <Footer />
    </div>
  );
};

LandingPage.propTypes = {
  classes: PropTypes.object,
  isLogin: PropTypes.bool,
  clearToken: PropTypes.func,
  name: PropTypes.string,
  token: PropTypes.string,
  isAdmin: PropTypes.bool
};

export default withStyles(landingPageStyle)(LandingPage);
