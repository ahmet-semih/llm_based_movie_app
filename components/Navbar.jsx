import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../src/firebase";
import "../css/Navbar.css"
import { MdHome } from "react-icons/md";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return <nav className="navbar">
        <div className="navbar-brand">
            Movie App
        </div>
        <div className="navbar-links">
            <Link to="/movies" className="nav-link">
            <MdHome style={{ marginRight: "5px", verticalAlign: "middle", marginBottom: "2px" }}/>Home
            </Link>
            <Link to="/favorites" className="nav-link">Favorites</Link>
            <Link to="/asktoAi" className="nav-link">Ask to AI</Link>
            <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
        </div>
    </nav>
}

export default Navbar