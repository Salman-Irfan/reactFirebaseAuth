import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { firebaseAuth } from '../../config/firebaseConfig/firebaseConfig';

const Login = () => {
    const navigate = useNavigate();
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    const [resetEmail, setResetEmail] = useState(''); // For resetting the password

    const handleSignIn = async () => {
        try {
            const response = await signInWithEmailAndPassword(
                firebaseAuth,
                signInEmail,
                signInPassword
            );

            const user = response.user;

            if (user) {
                // Check if the user's email is verified
                if (user.emailVerified) {
                    const idToken = await user.getIdToken(); // Fetch the ID token

                    // Save the token in localStorage
                    localStorage.setItem('user_idToken', idToken);

                    // Navigate to Shops
                    navigate('/');
                } else {
                    // If email is not verified, show an alert
                    alert('Email Not Verified. Please verify your email before logging in.');
                }
            }
        } catch (error) {
            console.error('Error during sign-in:', error.message);
            alert(error.message);
        }
    };

    const handleResetPassword = async () => {
        if (!resetEmail) {
            alert('Please enter your email to reset your password.');
            return;
        }
        try {
            await sendPasswordResetEmail(firebaseAuth, resetEmail);
            alert('Password reset email sent. Please check your inbox.');
        } catch (error) {
            console.error('Error sending password reset email:', error.message);
            alert(error.message);
        }
    };

    return (
        <div className="container">
            <h1 className="title">Sign In</h1>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSignIn();
                }}
            >
                <input
                    type="email"
                    className="input"
                    placeholder="Email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    className="input"
                    placeholder="Password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                />

                <button type="submit" className="button">
                    Sign In
                </button>
            </form>

            {/* Reset Password Section */}
            <div className="reset-password">
                <h3>Reset Password</h3>
                <input
                    type="email"
                    className="input"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                />
                <button onClick={handleResetPassword} className="button">
                    Reset Password
                </button>
            </div>
        </div>
    );
};

export default Login;
