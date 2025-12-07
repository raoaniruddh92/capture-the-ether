import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <Link to="/challenges">
        <button>Go to Challenges</button>
      </Link>
    </div>
  );
}

export default Home;
