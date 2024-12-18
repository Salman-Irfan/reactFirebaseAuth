import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if auth token exists in localStorage
        const authToken = localStorage.getItem("user_idToken");
        setIsAuthenticated(!!authToken);
    }, []); // Runs once on component mount

    const handleLogout = () => {
        // Remove the auth token
        localStorage.removeItem("user_idToken");
        setIsAuthenticated(false);
        navigate("/auth/login"); // Redirect to login page
    };

    return (
        <>
            <div>React Firebase Firestore and Authentication</div>
            <nav>
                <ul>
                    <Link to={`/`}>
                        <li>Add Product</li>
                    </Link>
                    <Link to={`/all-products`}>
                        <li>All Products</li>
                    </Link>
                    {/* add course */}
                    <Link to={`/course/add-course`}>
                        <li>
                            Add Course
                        </li>
                    </Link>
                    <Link to={`/course/all-courses`}>
                        <li>
                            All Courses
                        </li>
                    </Link>
                    {isAuthenticated ? (
                        <li>
                            <button onClick={handleLogout}>Logout</button>
                        </li>
                    ) : (
                        <>
                            <Link to={`/auth/signup`}>
                                <li>
                                    <button>Sign Up</button>
                                </li>
                            </Link>
                            <Link to={`/auth/login`}>
                                <li>
                                    <button>Login</button>
                                </li>
                            </Link>
                        </>
                    )}
                </ul>
            </nav>
        </>
    );
};

export default Navbar;
