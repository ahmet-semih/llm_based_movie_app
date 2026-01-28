import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../../components/Navbar";
import MovieCard from "../../components/MovieCard";
import "../../css/MovieHomesc.css";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const favsRef = collection(db, "users", user.uid, "favorites");
        const snapshot = await getDocs(favsRef);
        const favMovies = snapshot.docs.map((doc) => doc.data());
        setFavorites(favMovies);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="home">
          <p>Loading favorites...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="home">
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>My Favorites</h2>
        {favorites.length === 0 ? (
          <p style={{ textAlign: "center" }}>You have no favorite movies yet.</p>
        ) : (
          <div className="movies-grid">
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
