import { Link } from "react-router-dom";

function Challenges() {
  return (
    <div className="terminal-wrapper">
      <h1 className="terminal-header">GhostLedger</h1>

      <div className="terminal-card">
        <h2>Challenge 1</h2>
        <p>Solve the first vulnerability and complete the task.</p>
        <Link to="/challenge1" className="cy-button">
          ▶ Start Challenge 1
        </Link>
      </div>

      <div className="terminal-card">
        <h2>Challenge 2</h2>
        <p>Interact with the smart contract to complete the level.</p>
        <Link to="/challenge2" className="cy-button">
          ▶ Start Challenge 2
        </Link>
      </div>

      <div className="terminal-card">
        <h2>Challenge 3</h2>
        <p>Guess the random number</p>
        <Link to="/challenge3" className="cy-button">
          ▶ Start Challenge 3
        </Link>
      </div>
    </div>
  );
}

export default Challenges;
