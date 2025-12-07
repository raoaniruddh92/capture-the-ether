import { Link } from "react-router-dom";
import "./cyberpunk-home.css"; // ⬅ new stylesheet

function Home() {
  return (
    <div className="home-wrapper">
      <div className="scan-lines"></div>

      <h1 className="title">GhostLedger</h1>
      <p className="subtitle">Blockchain security challenges</p>

      <Link to="/challenges">
        <button className="enter-btn">ENTER CHALLENGES</button>
      </Link>

      <p className="footer-text">Protocol v1.0 — Unauthorized access is forbidden</p>
    </div>
  );
}

export default Home;
