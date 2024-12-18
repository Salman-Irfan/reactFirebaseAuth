import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup } from 'firebase/auth';
import { firebaseAuth } from '../../config/firebaseConfig/firebaseConfig';

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        console.log({ name, email, age, password });
        try {
            const userCredential = await createUserWithEmailAndPassword(
                firebaseAuth,
                email,
                password
            );
            console.log(userCredential.user);

            if (userCredential.user) {
                const user = userCredential.user;

                // Send email verification
                await sendEmailVerification(user);

                alert(
                    'Verification Email Sent. Please check your email and verify your account before logging in.'
                );

                // Redirect to login page
                navigate('/auth/login');
            } else {
                alert('Token not found');
            }
        } catch (error) {
            console.error('Error during sign-up:', error.message);
            alert(error.message);
        }
    };

    // sign in with google
    
    const googleProvider = new GoogleAuthProvider()

    const handleSignInWithGoogle = async () => {
        try {
            const response = await signInWithPopup(firebaseAuth, googleProvider)
            console.log(response)
            console.log(response.user)
            console.log(response.user.accessToken)
            // navigate
            if (response.user.accessToken){
                const idToken = response.user.accessToken; // Fetch the ID token
                // Save the token in localStorage
                localStorage.setItem('user_idToken', idToken);
                navigate(`/`)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="container">
            <h1 className="title">Sign Up</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSignUp();
                }}
            >
                <input
                    type="text"
                    className="input"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    type="email"
                    className="input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="number"
                    className="input"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                />

                <input
                    type="password"
                    className="input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="button">
                    Sign Up
                </button>
            </form>
            {/* sign in with google */}
            <button onClick={handleSignInWithGoogle}>
                Sign In with Google
            </button>
            
        </div>
    );
};

export default Signup;
