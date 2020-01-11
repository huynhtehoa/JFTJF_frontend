import React from "react";
import isChrome from "./helper/chromeValidator";
import KeyboardVoice from "@material-ui/icons/KeyboardVoice";
import Button from "components/CustomButtons/Button.jsx";

export default function VoiceButton({
  searchIconClass,
  toggleListen,
  isListening
}) {
  if (isChrome) {
    return (
      <Button
        justIcon
        round
        color="white"
        style={{
          marginTop: 20,
          backgroundColor: isListening ? "green" : "white",
          color: isListening ? "white" : "#999999"
        }}
        onClick={toggleListen}
      >
        <KeyboardVoice className={searchIconClass} />
      </Button>
    );
  } else {
    return null;
  }
}
