import React, { useState } from "react";

import PropTypes from "prop-types";

import Search from "@material-ui/icons/Search";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import VoiceButton from "./Voice/VoiceButton";
import VoiceInstruction from "./Voice/VoiceInstruction";

import handleListen from "./Voice/VoiceHandler";

export default function BodyContent({ classes, setInputSearch, search }) {
  const [isListening, setIsListening] = useState(false);

  const toggleListen = () => {
    setIsListening(true);
    handleListen(isListening, setInputSearch, handleSubmit);
  };

  const onSearchChange = e => {
    setInputSearch(e.target.value.toLowerCase());
  };

  const handleSubmit = e => {
    e.preventDefault();
    search();
  };

  return (
    <Parallax filter image={require("assets/img/healthyfood.jpg")}>
      <div className={classes.container}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <h1
              className={`${classes.title} dropcap`}
              style={{ lineHeight: 1.15 }}
            >
              Junk Food <br /> oy Food{" "}
              <span style={{ fontSize: 20, verticalAlign: 26 }}>to</span>
            </h1>
            <h4>
              Want a healthier lifestyle? Start with your food today! Simple
              type in your favorite junk food, press Enter and voilà! Here comes
              the magic!
              <VoiceInstruction searchIconClass={classes.searchIcon} />
            </h4>
            <br />
            <form style={{ display: "flex" }} onSubmit={handleSubmit}>
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
                    onChange: onSearchChange
                  }
                }}
              />
              <Button
                justIcon
                round
                color="white"
                style={{ marginTop: 20 }}
                onClick={handleSubmit}
              >
                <Search className={classes.searchIcon} />
              </Button>
              <VoiceButton
                searchIconClass={classes.searchIcon}
                toggleListen={toggleListen}
                isListening={isListening}
              />
            </form>
          </GridItem>
        </GridContainer>
      </div>
    </Parallax>
  );
}

BodyContent.propTypes = {
  classes: PropTypes.object,
  setInputSearch: PropTypes.func,
  search: PropTypes.func,
  loginSearch: PropTypes.func,
  isLogin: PropTypes.bool
};
