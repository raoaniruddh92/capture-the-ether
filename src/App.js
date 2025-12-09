import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home.js";
import Challenges from "./Challenges/Challenges.js";
import Challenges1 from "./Challenges/Challenge1.js";
import Challenges2 from "./Challenges/Challenge2.js";
import Challenges3 from "./Challenges/Challenge3.js";
import Challenges4 from "./Challenges/Challenge4.js";
import Challenges5 from "./Challenges/Challenge5.js";
import Challenges6 from "./Challenges/Challenge6.js";
import Challenges7 from "./Challenges/Challenge7.js";
import Challenges8 from "./Challenges/Challenge8.js";
import Challenges9 from "./Challenges/Challenge9.js";

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
          <Route path="/challenge4" element={<Challenges4 />} />
          <Route path="/challenge5" element={<Challenges5 />} />
          <Route path="/challenge6" element={<Challenges6 />} />
          <Route path="/challenge7" element={<Challenges7 />} />
          <Route path="/challenge8" element={<Challenges8 />} />
          <Route path="/challenge9" element={<Challenges9 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
