import React from "react";
import { Redirect } from "react-router-dom";

import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";

import Search from "@material-ui/icons/Search";
import KeyboardVoice from "@material-ui/icons/KeyboardVoice";

import CustomInput from "components/CustomInput/CustomInput.jsx";
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";

import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";

var isChromium = window.chrome;
var winNav = window.navigator;
var vendorName = winNav.vendor;
var isOpera = typeof window.opr !== "undefined";
var isIEedge = winNav.userAgent.indexOf("Edge") > -1;
var isIOSChrome = winNav.userAgent.match("CriOS");
var SpeechRecognition
var recognition

if (isIOSChrome) {
  SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition

  recognition = new SpeechRecognition()

  recognition.continous = true
  recognition.interimResults = true
  recognition.lang = 'en-US'

} else if (
  isChromium !== null &&
  typeof isChromium !== "undefined" &&
  vendorName === "Google Inc." &&
  isOpera === false &&
  isIEedge === false
) {
  SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition

  recognition = new SpeechRecognition()

  recognition.continous = true
  recognition.interimResults = true
  recognition.lang = 'en-US'
}

const dashboardRoutes = [];

class LandingPage extends React.Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      inputSearch: "",
      searchData: [],
      isSearched: false,
      listening: false,
    }
  }

  toggleListen = () => {
    this.setState({
      listening: !this.state.listening
    }, this.handleListen)
  }

  handleListen = () => {

    if (this.state.listening) {
      recognition.start()
      recognition.onend = () => {
        recognition.start()
      }

    } else {
      recognition.stop()
    }

    let finalTranscript = ''
    recognition.onresult = event => {
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase();
        if (event.results[i].isFinal) finalTranscript += transcript + ' ';
        else interimTranscript += transcript;
      }
      document.getElementById('float').value = finalTranscript.replace(/finish/ig, "")
      this.setState({
        inputSearch: finalTranscript.replace(/finish/ig, "").toLowerCase()
      })

      const transcriptArr = finalTranscript.split(' ')
      const stopCmd = transcriptArr.slice(-3, -1)

      stopCmd.map(element => {
        if (element === "finish") {
          recognition.stop()
          recognition.onend = () => {
            this.handleSubmit(event)
          }
        }
      })
    }

    recognition.onerror = event => {
      console.log("Error occurred in recognition: " + event.error)
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
        "Authorization": `Token ${localStorage.getItem('token')}`
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

  VoiceButton = () => {
    if (isIOSChrome) {
      return (
        <Button justIcon round color="white" style={{ marginTop: 20, backgroundColor: (this.state.listening) ? "green" : "white", color: (this.state.listening) ? "white" : "#999999" }} onClick={this.toggleListen}>
          <KeyboardVoice className={this.props.classes.searchIcon} />
        </Button>
      )

    } else if (
      isChromium !== null &&
      typeof isChromium !== "undefined" &&
      vendorName === "Google Inc." &&
      isOpera === false &&
      isIEedge === false
    ) {
      return (
        <Button justIcon round color="white" style={{ marginTop: 20, backgroundColor: (this.state.listening) ? "green" : "white", color: (this.state.listening) ? "white" : "#999999" }} onClick={this.toggleListen}>
          <KeyboardVoice className={this.props.classes.searchIcon} />
        </Button>
      )
    } else {
      return null
    }
  }

  render() {
    const { classes, clearToken, isLogin, name, token, isAdmin, ...rest } = this.props;
    const { isSearched, inputSearch, searchData } = this.state;

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
            inputSearch,
            isAdmin
          }
        }}
      />
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
                <h1 className={classes.title + " " + "dropcap"} style={{ lineHeight: 1.15 }}>Junk Food <br /> oy Food <span style={{ fontSize: 20, verticalAlign: 26 }}>to</span></h1>
                <h4>
                  Want a healthier lifestyle? Start with your food today! Simple type in your favorite junk food, press Enter and voilà! Here comes the magic!
                  <div>
                    To use speech-to-text (Chrome browser only): Click <KeyboardVoice className={this.props.classes.searchIcon} />. Say out loud your favorite junk food then say the magical word "FINISH"!
                  </div>
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
                  <this.VoiceButton />
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
