import React, { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig/firebaseConfig";
import { getAuth, onAuthStateChanged, deleteUser, reauthenticateWithCredential, EmailAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const AddProduct = () => {
    const [product, setProduct] = useState({
        title: "",
        description: "",
        category: "",
        price: "",
    });

    const [userEmail, setUserEmail] = useState(null); // State to store user email
    const navigate = useNavigate();

    // Protected Route logic
    useEffect(() => {
        const authToken = localStorage.getItem("user_idToken");
        if (!authToken) {
            navigate("/auth/login");
        }

        // Get logged-in user's email
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email); // Save email to state
            } else {
                setUserEmail(null);
            }
        });
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await addDoc(collection(db, "products"), product);
            console.log(response);
            alert("Product added successfully!");
            setProduct({ title: "", description: "", category: "", price: "" }); // Reset form
        } catch (error) {
            console.error("Error adding product: ", error);
            alert("Failed to add product. Please try again.");
        }
    };

    const handleDeleteAccount = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                try {
                    const providerId = user.providerData[0]?.providerId;

                    if (providerId === "password") {
                        // For email/password users
                        const password = prompt("Please re-enter your password to confirm deletion:");
                        if (password) {
                            const credential = EmailAuthProvider.credential(user.email, password);
                            await reauthenticateWithCredential(user, credential);
                        } else {
                            alert("Password is required to delete the account.");
                            return;
                        }
                    } else if (providerId === "google.com") {
                        // For Google sign-in users
                        const googleProvider = new GoogleAuthProvider();
                        const result = await signInWithPopup(auth, googleProvider);
                        if (!result.user) {
                            throw new Error("Google reauthentication failed. Please try again.");
                        }
                    } else {
                        alert("Unsupported sign-in method.");
                        return;
                    }
                    // Delete user after successful re-authentication
                    await deleteUser(user);
                    alert("Account deleted successfully.");
                    localStorage.removeItem("user_idToken");
                    navigate("/auth/login"); // Redirect to login page
                } catch (error) {
                    if (error.code === "auth/requires-recent-login") {
                        alert("You need to re-authenticate before deleting your account.");
                    } else {
                        console.error("Error during account deletion: ", error);
                        alert("Failed to delete account. Please try again.");
                    }
                }
            }
        } else {
            alert("No user is logged in.");
        }
    };


    return (
        <div style={{ padding: "20px" }}>
            <Link to={`/all-products`}>
                <button>All Products</button>
            </Link>
            <h1>Add Product</h1>
            {/* Display logged-in user's email */}
            {userEmail && <p>Logged in as: <strong>{userEmail}</strong></p>}
            {/* delete account */}
            <button onClick={handleDeleteAccount}>Delete Account</button>
            <form onSubmit={handleAddProduct}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={product.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Category:</label>
                    <input
                        type="text"
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
