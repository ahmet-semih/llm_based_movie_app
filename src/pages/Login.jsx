import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "../../css/Login.css";

export default function Login({ onBack , onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        alert("Logged in successfully & verified in Firestore 🎉");
        onSuccess();
      } else {
        alert("Logged in, but user data not found in Firestore ⚠️");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      alert("Please enter your email address first");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      alert("Password reset email sent! Check your inbox 📧");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        alert("No account found with this email");
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address");
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <div className="input-group">
          <input
            className="auth-input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="button-group-vertical">
          <button className="primary-btn" onClick={handleLogin}>Login</button>
          <button 
            className="forgot-password-btn" 
            onClick={handleForgotPassword}
            disabled={loading}
          >
            {loading ? "Sending..." : "Forgot Password?"}
          </button>
          {resetSent && (
            <p className="reset-message">✓ Reset email sent to {email}</p>
          )}
          <button className="text-btn" onClick={onBack}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}