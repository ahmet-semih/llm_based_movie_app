import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import "../../css/Register.css";

export default function Register({ onBack }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();
      if (!trimmedFirstName || !trimmedLastName) {
        alert("Please enter your name and surname.");
        return;
      }

      const userCredential =
        await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;

      //THIS writes to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        createdAt: serverTimestamp(),
      });

      alert("User registered & saved to Firestore ✅");

      if (onBack) onBack();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <div className="input-group">
          <input
            className="auth-input"
            placeholder="Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Surname"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
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
          <button className="primary-btn" onClick={handleRegister}>Register</button>
          <button className="text-btn" onClick={onBack}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}