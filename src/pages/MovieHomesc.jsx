import MovieCard from "../../components/MovieCard";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import "../../css/MovieHomesc.css";
import { getpopularMovies,searchMovies} from "../../services/api";

const MOVIES_PER_PAGE = 15;

function MovieHomesc() {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);      // All 100 movies
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const load_popular_movies = async () => {
            try {
                const popularMovies = await getpopularMovies();
                setMovies(popularMovies);
            } catch (err) {
                setError("Failed to load movies. Please try again later.");
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
    load_popular_movies();
    }, []);


    // Filter movies based on search query (searches all 100 movies)
    const filteredMovies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Paginate: show only 16 movies at a time
    const totalPages = Math.ceil(filteredMovies.length / MOVIES_PER_PAGE);
    const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
    const displayedMovies = filteredMovies.slice(startIndex, startIndex + MOVIES_PER_PAGE);

    // Reset to page 1 when search query changes
    function handleSearchChange(e) {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    }

    function handleSearch(e) {
        e.preventDefault();
        setCurrentPage(1);
    }

    return (
        <>
            <Navbar />
            <div className="home">
                <form onSubmit={handleSearch} className="search-form">
                    <input 
                        type="text" 
                        placeholder="Search movies..." 
                        className="search-input" 
                        value={searchQuery} 
                        onChange={handleSearchChange} 
                    />
                    <button type="submit" className="search-button">Search</button>
                </form>

                {error && <p className="error-message">{error}</p>}
                {loading && <p className="loading-message">Loading movies...</p>}

                <div className="movies-grid">
                    {displayedMovies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button 
                            onClick={() => {
                                setCurrentPage(p => Math.max(1, p - 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === 1}
                            className="pagination-btn"
                        >
                            ← Prev
                        </button>
                        <span className="pagination-info">
                            Page {currentPage} of {totalPages} ({filteredMovies.length} movies)
                        </span>
                        <button 
                            onClick={() => {
                                setCurrentPage(p => Math.min(totalPages, p + 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === totalPages}
                            className="pagination-btn"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
export default MovieHomesc;