import { deleteDoc, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../config/firebaseConfig/firebaseConfig";

const ProductDetails = () => {
    const { id } = useParams(); // Get the product ID from the URL parameters
    const navigate = useNavigate(); // Initialize navigate hook
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProductDetails = async () => {
        try {
            const productDocRef = doc(db, "products", id);
            const productDocSnapshot = await getDoc(productDocRef);
            if (productDocSnapshot.exists()) {
                setProduct(productDocSnapshot.data());
            } else {
                console.error("No product found with the given ID");
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const handleDeleteProduct = async(id) => {
        try {
            const productDocRef = doc(db, 'products', id);
            const deleteResponse = await deleteDoc(productDocRef);
            alert("Product deleted successfully");
            navigate(-1); // Navigate back to the previous page
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    if (loading) {
        return <p>Loading product details...</p>;
    }

    if (!product) {
        return <p>Product not found.</p>;
    }

    return (
        <>
            <div>
                <h1>Product Details</h1>
                <h2>{product.title}</h2>
                <p>{product.description}</p>
                <p>Category: {product.category}</p>
                <p>Price: ${product.price}</p>
            </div>
            {/* delete product */}
            <button onClick={() => handleDeleteProduct(id)}>Delete</button>
            {/* update */}
            <Link to={`/update-product/${id}`}><button>Update</button></Link>
        </>
    );
};

export default ProductDetails;
