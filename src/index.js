import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/scss/material-kit-react.scss?v=1.7.0";

import LandingPage from "views/LandingPage/LandingPage.jsx";
import DiscoverPage from "views/DiscoverPage/DiscoverPage.jsx";
import RegisterPage from "views/RegisterPage/RegisterPage.jsx";
import LoginPage from "views/LoginPage/LoginPage.jsx";
import Replacement from "views/Sections/Replacement.jsx";
import ForgetPw from "views/Sections/ForgetPw.jsx";
import ResetPw from "views/Sections/ResetPw.jsx";
import ChangePw from "views/Sections/ChangePw.jsx";
import ContactUs from "views/ContactUs/ContactUs.jsx";
import AddMore from "views/AddMorePage/AddMore.jsx";
import EditRecipe from "views/EditPage/EditRecipe.jsx"
import FavoritePage from "views/FavoritePage/FavoritePage.jsx"

var hist = createBrowserHistory();

const App = () => {

  const [token, setToken] = useState('')
  const [isLogin, setLogin] = useState(false)
  const [name, setName] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const accessToken = (window.location.search.split("=")[0] === "?api_key") ? window.location.search.split("=")[1] : null;
    if (accessToken) {
      sessionStorage.setItem('token', accessToken.replace('?api_key=', ''))
      setToken(accessToken)
      setLogin(true)
    }
    const existingToken = sessionStorage.getItem('token');
    if (existingToken) {
      setToken(existingToken)
      setLogin(true)
    }
    getWithToken()
  }, [])

  const getWithToken = async () => {
    const url = `https://jftjf-backend.herokuapp.com/auth`;
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Token ${sessionStorage.getItem('token')}`,
      }
    })
    let jsonData = await response.json()
    setName(jsonData.name)
    setIsAdmin(jsonData.isAdmin)
    setLogin(true)
  }

  const clearToken = () => {
    clearBackendToken()
    sessionStorage.clear("token")
    setName('')
    setIsAdmin(false)
    setLogin(false)
  }

  const clearBackendToken = async () => {
    const url = `https://jftjf-backend.herokuapp.com/logout`;
    await fetch(url, {
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Token ${sessionStorage.getItem('token')}`,
      }
    })
  }

  return (
    <Router history={hist}>
      <Switch>
        <Route exact path="/" component={() => <LandingPage isLogin={isLogin} clearToken={clearToken} name={name} token={token} isAdmin={isAdmin} />} />
        <Route exact path="/replacement/:inputSearch" component={Replacement} />
        <Route exact path="/favorite/" component={FavoritePage} />
        <Route exact path="/addmore" component={() => <AddMore isLogin={isLogin} clearToken={clearToken} name={name} token={token} isAdmin={isAdmin} />} />
        <Route exact path="/register-page" component={() => <RegisterPage token={token} isAdmin={isAdmin} name={name} isLogin={isLogin} />} />
        <Route exact path="/login-page" component={() => <LoginPage isLogin={isLogin} getWithToken={getWithToken} clearToken={clearToken} name={name} token={token} isAdmin={isAdmin} />} />
        <Route exact path="/forget-pw" component={ForgetPw} />
        <Route exact path="/reset-pw/:token" component={ResetPw} />
        <Route exact path="/change-pw/" component={ChangePw} />
        <Route exact path="/discover" component={() => <DiscoverPage isLogin={isLogin} getWithToken={getWithToken} clearToken={clearToken} name={name} token={token} isAdmin={isAdmin} />} />
        <Route exact path="/edit/recipe/:dataId" component={EditRecipe} />
        <Route exact path="/contactus" component={() => <ContactUs isLogin={isLogin} clearToken={clearToken} name={name} token={token} isAdmin={isAdmin} />} />
        {/* <Route component={NotFound} /> */}
      </Switch>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))

