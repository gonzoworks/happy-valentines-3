import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const backgroundMusic = useRef(null); // Ref for the background music

  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [titleMessage, setTitleMessage] = useState("Will You Be My Valentine?");
  const [gifSrc, setGifSrc] = useState("/valentine.gif");
  const [noButtonStyle, setNoButtonStyle] = useState({});
  const [hoverCount, setHoverCount] = useState(0);

  useEffect(() => {
    // Initialize the background music
    backgroundMusic.current = new Audio("/sounds/background.mp3");
    backgroundMusic.current.loop = true;
    backgroundMusic.current.volume = 0.2;

    // Cleanup on unmount
    return () => {
      if (backgroundMusic.current) {
        backgroundMusic.current.pause();
        backgroundMusic.current.currentTime = 0;
      }
    };
  }, []);

  const handleHoverOpenButton = () => {
    // Play the background music on hover
    if (backgroundMusic.current) {
      backgroundMusic.current.play().catch((error) => {
        console.error("Autoplay blocked or failed:", error.message);
      });
    }
  };

  const handleOpenEnvelope = () => {
    const flapElement = document.querySelector(".flap");
    const openSound = new Audio("/sounds/open.wav"); // Envelope opening sound
    openSound.play();

    if (flapElement) {
      flapElement.classList.add("open"); // Open the flap
      setTimeout(() => {
        setIsEnvelopeOpen(true); // Show loading screen
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false); // Show main content
          setIsTransitioning(true); // Trigger white flash
          setTimeout(() => setIsTransitioning(false), 800); // End white flash
        }, 3000); // 3-second loading delay
      }, 1000); // Flap animation duration
    }
  };

  const handleYesClick = () => {
    const clickSound = new Audio("/sounds/congrats.mp3");
    clickSound.play();
    setTitleMessage("You're mine forever now c:<");
    setGifSrc("/yesvalentine.gif");
  };

  const handleNoClick = () => {
    const clickSound = new Audio("/sounds/click.mp3");
    clickSound.play();
    setTitleMessage("Too bad :p");
    setNoButtonStyle({
      transform: "translateY(100vh)",
      transition: "transform 1s ease-in",
    });

    setTimeout(() => {
      setNoButtonStyle({});
      setTitleMessage("Will You Be My Valentine?");
      setGifSrc("/valentine.gif");
      setHoverCount(0);
    }, 10000);
  };

  const handleNoHover = (e) => {
    const button = e.target;
    const hoverSound = new Audio("/sounds/hover.mp3"); // Optional hover sound
    hoverSound.play();
    setGifSrc("/novalentine.gif");

    const randomX = Math.random() * 400 - 200;
    const randomY = Math.random() * 200 - 100;
    button.style.transform = `translate(${randomX}px, ${randomY}px)`;

    setHoverCount((prev) => prev + 1);
    const newScale = Math.max(0.5, 1 - hoverCount * 0.1);
    button.style.transform += ` scale(${newScale})`;
  };

  const handleNoLeave = () => setGifSrc("/valentine.gif");

  return (
    <div className="App">
      {isTransitioning && <div className="white-flash"></div>}
      {!isEnvelopeOpen ? (
        <div className="envelope-container">
          <div className="envelope">
            <div className="flap"></div>
          </div>
          <button
            className="openButton"
            onClick={handleOpenEnvelope}
            onMouseEnter={handleHoverOpenButton} // Trigger background music on hover
          >
            Open Me
          </button>
        </div>
      ) : isLoading ? (
        <div className="loading-screen">
          <img src="/hearts-loading.gif" alt="Loading..." className="loading-gif" />
        </div>
      ) : (
        <div className="shimmering-background">
          <img src={gifSrc} alt="Dynamic GIF" className="gif" />
          <h1>{titleMessage}</h1>
          <div className="buttons">
            <button className="yesButton" onClick={handleYesClick}>
              YES OF COURSE
            </button>
            <button
              className="noButton"
              style={noButtonStyle}
              onMouseOver={handleNoHover}
              onMouseLeave={handleNoLeave}
              onClick={handleNoClick}
            >
              No... T-T
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
