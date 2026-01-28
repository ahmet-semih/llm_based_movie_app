import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../src/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Subscribe to auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Auth state changed:", currentUser ? currentUser.email : "No user");
            setUser(currentUser);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Show loading while checking auth
    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                color: 'white',
                fontSize: '1.2rem',
                backgroundColor: '#141414'
            }}>
                Loading...
            </div>
        );
    }

    // Not logged in - redirect to login
    if (!user) {
        console.log("No user, redirecting to /login");
        return <Navigate to="/login" replace />;
    }

    // User is logged in - show the protected content
    return children;
}
