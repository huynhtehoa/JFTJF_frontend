import isChrome from "./helper/chromeValidator";

let SpeechRecognition;
let recognition;

if (isChrome) {
  SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition;

  recognition = new SpeechRecognition();

  recognition.continous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";
}

export default function handleListen(
  isListening,
  setInputSearch,
  handleSubmit
) {
  if (isListening) {
    recognition.start();
    recognition.onend = () => {
      recognition.start();
    };
  } else {
    recognition.stop();
  }

  let finalTranscript = "";
  recognition.onresult = event => {
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript.toLowerCase();
      if (event.results[i].isFinal) finalTranscript += transcript + " ";
      else interimTranscript += transcript;
    }
    document.getElementById("float").value = finalTranscript.replace(
      /finish/gi,
      ""
    );
    setInputSearch(finalTranscript.replace(/finish/gi, "").toLowerCase());

    const transcriptArr = finalTranscript.split(" ");
    const stopCmd = transcriptArr.slice(-3, -1);

    stopCmd.map(element => {
      if (element === "finish") {
        recognition.stop();
        recognition.onend = () => {
          handleSubmit(event);
        };
      }
    });
  };

  recognition.onerror = event => {
    console.log("Error occurred in recognition: " + event.error);
  };
}
