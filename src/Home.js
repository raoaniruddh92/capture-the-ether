import { Link } from "react-router-dom";
import "./cyberpunk-home.css"; // ⬅ new stylesheet

function Home() {
  return (
    <div className="home-wrapper">
      <div className="scan-lines"></div>

      <h1 className="title">GhostLedger</h1>
      <p className="subtitle">Blockchain security challenges-A collection of all the challenges on different sites you can't play anymore</p>


      <p className="subtitle">I made this because capture the ether has been depracated for a while now ;( </p>
      <p className="subtitle" >This project is fully open source so feel free to contribute</p>

      <Link to="/challenges">
        <button className="enter-btn">ENTER CHALLENGES</button>
      </Link>

      <p className="footer-text">Protocol v1.0 — Unauthorized access is forbidden-d3cod3rd3m0n</p>
    </div>
  );
}

export default Home;
