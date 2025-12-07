import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home.js";
import Challenges from "./Challenges/Challenges.js";
import Challenges1 from "./Challenges/Challenge1.js";
import Challenges2 from "./Challenges/Challenge2.js";
import Challenges3 from "./Challenges/Challenge3.js";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenge1" element={<Challenges1 />} />
          <Route path="/challenge2" element={<Challenges2 />} />
          <Route path="/challenge3" element={<Challenges3 />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
