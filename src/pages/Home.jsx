import { useNavigate } from "react-router-dom";
import "../../css/Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="home-card">
        <h1>
          Movie Selection App
        </h1>
        <div className="button-group">
          <button className="primary-btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="secondary-btn" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
