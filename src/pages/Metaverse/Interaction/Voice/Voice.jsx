import "./styles-voice.css";
import { useState, useCallback } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { init } from "../../../../services/socket-voice.js";

/**
 * Component for controlling voice input/output.
 * @returns {JSX.Element} The JSX.Element containing the voice control button.
 */
export default function Voice() {
  const [isSpeaking, setIsSpeaking] = useState(false); // State to track if the user is speaking
  const [callPeers, setCallPeers] = useState(true); // State to track if peers should be called

  // Function to start speaking
  const speak = useCallback(() => {
    setIsSpeaking(true);

    if (callPeers) {
      setCallPeers(false);
      init();
    }
  }, [callPeers]);

  // Function to stop speaking
  const stop = useCallback(() => {
    setIsSpeaking(false);
  }, []);

  return (
    <div className="button-speak">
      <button onClick={isSpeaking ? stop : speak}>
        {isSpeaking ? (
          <FaMicrophone className="icon-speak" />
        ) : (
          <FaMicrophoneSlash className="icon-speak" />
        )}
      </button>
    </div>
  );
}
