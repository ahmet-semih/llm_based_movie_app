import { useEffect, useState } from "react";
import { auth, db } from "../src/firebase";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import '../css/MovieCard.css';

function MovieCard({ movie }) {
  const [isFav, setIsFav] = useState(false);

  // Check if the movie is already a favorite when the component mounts
  useEffect(() => {
    const checkFavorite = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const favRef = doc(db, "users", user.uid, "favorites", String(movie.id));
      const snap = await getDoc(favRef);
      setIsFav(snap.exists());
    };
    checkFavorite();
  }, [movie.id]);

  async function toggleFavorite() {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to favorite a movie.");
      return;
    }

    const favRef = doc(db, "users", user.uid, "favorites", String(movie.id));

    if (isFav) {
      // Remove from favorites
      await deleteDoc(favRef);
      setIsFav(false);
    } else {
      // Add to favorites
      await setDoc(favRef, {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date || "",
      });
      setIsFav(true);
    }
  }

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
        <div className="movie-overlay">
          <button
            type="button"
            className={`favorite-btn ${isFav ? "is-fav" : ""}`}
            onClick={toggleFavorite}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            title={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            {isFav ? "♥" : "♡"}
          </button>
        </div>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.split("-")[0]}</p>
      </div>
    </div>
  );
}

export default MovieCard;