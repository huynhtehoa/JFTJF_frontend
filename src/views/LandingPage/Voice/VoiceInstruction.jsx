import React from "react";
import isChrome from "./helper/chromeValidator";
import KeyboardVoice from "@material-ui/icons/KeyboardVoice";

export default function VoiceInstruction({ searchIconClass }) {
  if (isChrome) {
    return (
      <div style={{ marginTop: 20 }}>
        To use speech-to-text: Click{" "}
        <KeyboardVoice className={searchIconClass} />. Say out loud your
        favorite junk food then say the magical word "FINISH"!
      </div>
    );
  } else {
    return null;
  }
}
