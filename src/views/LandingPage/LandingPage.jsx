import React from "react";
import { Redirect } from "react-router-dom";

import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";

import Search from "@material-ui/icons/Search";

import CustomInput from "components/CustomInput/CustomInput.jsx";
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";

import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";

const dashboardRoutes = [];

class LandingPage extends React.Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      inputSearch: "",
      searchData: [],
      isSearched: false,
    }
  }

  componentDidMount() {
    this._isMounted = true;

    this.setState({
      isSearched: false,
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onSearchChange = e => {
    this.setState({
      inputSearch: e.target.value.toLowerCase()
    })
  }

  searching = async () => {
    let url = 'https://jftjf-backend.herokuapp.com/search'
    let data = {
      'inputSearch': this.state.inputSearch
    }
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      }
    })
    let jsonData = await response.json()
    if (this._isMounted) {
      this.setState({
        searchData: jsonData.results,
        isSearched: true,
      })
    }
  }

  loginSearch = async () => {
    let url = 'https://jftjf-backend.herokuapp.com/searchlogin'
    let data = {
      'inputSearch': this.state.inputSearch
    }
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${sessionStorage.getItem('token')}`
      }
    })
    let jsonData = await response.json()
    if (this._isMounted) {
      this.setState({
        searchData: jsonData.results,
        isSearched: true,
      })
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    if (this.props.isLogin) {
      this.loginSearch()
    } else {
      this.searching()
    }
  }

  render() {
    const { classes, clearToken, isLogin, name, token, ...rest } = this.props;
    const { isSearched, inputSearch, searchData } = this.state;
    {
      if (isSearched) {
        return <Redirect to=
          {{
            pathname: `/replacement/${inputSearch}`,
            clearToken: clearToken,
            state:
            {
              searchData,
              name,
              isLogin,
              token,
              inputSearch
            }
          }} 
          />
      }
    }
    return (
      <div>
        <Header
          color="transparent"
          routes={dashboardRoutes}
          brand="Joy Foods"
          rightLinks={<HeaderLinks clearToken={clearToken} isLogin={isLogin} name={name} token={token} />}
          fixed
          changeColorOnScroll={{
            height: 400,
            color: "white"
          }}
          {...rest}
        />
        <Parallax filter image={require("assets/img/healthyfood.jpg")}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <h1 className={classes.title}>Junk Food to Joy Food</h1>
                <h4>
                  Want to live a healthier lifestyle? Start with your food now! Simply input any food items and we will recommend you a more deli and nutritious one!
                </h4>
                <br />
                <form style={{ display: "flex" }} onSubmit={this.handleSubmit}>
                  <CustomInput
                    white
                    labelText="Junk Food Here"
                    inputRootCustomClasses={classes.inputRootCustomClasses}
                    id="float"
                    formControlProps={{
                      className: classes.formControl,
                      fullWidth: true
                    }}
                    inputProps={{
                      inputProps: {
                        "aria-label": "Search",
                        autoFocus: true,
                        required: true,
                        className: classes.searchInput,
                        onChange: this.onSearchChange
                      }
                    }}
                  />
                  <Button justIcon round color="white" style={{ marginTop: 20 }} onClick={this.handleSubmit}>
                    <Search className={classes.searchIcon} />
                  </Button>
                </form>
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <Footer />
      </div>
    );
  }
}

LandingPage.propTypes = {
  classes: PropTypes.object
};

export default withStyles(landingPageStyle)(LandingPage);
