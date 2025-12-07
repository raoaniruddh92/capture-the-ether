import { Link } from "react-router-dom";

function Challenges() {
  return (
    <div className="terminal-wrapper">
      <h1 className="terminal-header">GhostLedger</h1>

      <div className="challenge-list">
        <h2>Intro challenges</h2>
        <div className="terminal-card">
          <h3>Challenge 1</h3>
          <p>Solve the first vulnerability and complete the task.</p>
          <Link to="/challenge1" className="cy-button">
            ▶ Start Challenge 1
          </Link>
        </div>

        <div className="terminal-card">
          <h3>Challenge 2</h3>
          <p>Interact with the smart contract to complete the level.</p>
          <Link to="/challenge2" className="cy-button">
            ▶ Start Challenge 2
          </Link>
        </div>
        <br></br>
        <h2>Randomness challenges</h2>
        <div className="terminal-card">
          <h3>Challenge 3</h3>
          <p>Guess the random number</p>
          <Link to="/challenge3" className="cy-button">
            ▶ Start Challenge 3
          </Link>
        </div>

        <div className="terminal-card">
          <h3>Challenge 4</h3>
          <p>Guess the random number pt-2</p>
          <Link to="/challenge4" className="cy-button">
            ▶ Start Challenge 4
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Challenges;
