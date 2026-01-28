import { useState, useRef, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { askGeminiWithContext } from '../../services/gemini';
import Navbar from '../../components/Navbar';
import '../../css/AsktoAi.css';

function AsktoAi() {
    const [messages, setMessages] = useState([
        { role: 'ai', text: "Hi! I'm your movie assistant 🎬 Ask me anything about movies or get personalized recommendations based on your favorites!" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const messagesEndRef = useRef(null);

    // Fetch user's favorites on mount
    useEffect(() => {
        const fetchFavorites = async () => {
            const user = auth.currentUser;
            if (!user) return;
            try {
                const favsRef = collection(db, "users", user.uid, "favorites");
                const snapshot = await getDocs(favsRef);
                const favMovies = snapshot.docs.map((doc) => doc.data());
                setFavorites(favMovies);
            } catch (err) {
                console.error("Failed to fetch favorites:", err);
            }
        };
        fetchFavorites();
    }, []);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setLoading(true);

        try {
            const response = await askGeminiWithContext(userMessage, favorites);
            setMessages(prev => [...prev, { role: 'ai', text: response }]);
        } catch (err) {
            console.error('Gemini error:', err);
            setMessages(prev => [...prev, { 
                role: 'ai', 
                text: "Sorry, I couldn't process your request. Please try again." 
            }]);
        } finally {
            setLoading(false);
        }
    };

    const suggestedQuestions = [
        "Recommend a movie based on my favorites",
        "What genre do I like most?",
        "Suggest something for tonight",
        "Find me an action movie"
    ];

    const handleSuggestionClick = (question) => {
        setInput(question);
    };

    return (
        <>
            <Navbar />
            <div className="chat-container">
                <div className="chat-header">
                    <div className="chat-header-icon">🤖</div>
                    <div className="chat-header-info">
                        <h2>Movie AI Assistant</h2>
                        <span className="status-indicator">
                            <span className="status-dot"></span>
                            {favorites.length > 0 
                                ? `Online • ${favorites.length} favorites loaded` 
                                : 'Online'}
                        </span>
                    </div>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.role}`}>
                            <div className="message-avatar">
                                {msg.role === 'ai' ? '🤖' : '👤'}
                            </div>
                            <div className="message-content">
                                <div className="message-bubble">
                                    {msg.text}
                                </div>
                                <span className="message-time">
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="message ai">
                            <div className="message-avatar">🤖</div>
                            <div className="message-content">
                                <div className="message-bubble typing">
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {messages.length === 1 && (
                    <div className="suggestions">
                        <p>Try asking:</p>
                        <div className="suggestion-chips">
                            {suggestedQuestions.map((q, i) => (
                                <button 
                                    key={i} 
                                    className="suggestion-chip"
                                    onClick={() => handleSuggestionClick(q)}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="chat-input-form">
                    <div className="chat-input-container">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about movies..."
                            className="chat-input"
                            disabled={loading}
                        />
                        <button 
                            type="submit" 
                            className="chat-send-btn"
                            disabled={loading || !input.trim()}
                        >
                            {loading ? (
                                <span className="send-loading"></span>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AsktoAi;
