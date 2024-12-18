import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig/firebaseConfig';

const UpdateProduct = () => {
    const { id } = useParams(); // Get product ID from the URL
    const navigate = useNavigate(); // Hook for navigation
    const [product, setProduct] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
    }); // State to hold the product data
    const [loading, setLoading] = useState(true);

    // Fetch the existing product data
    const fetchProduct = async () => {
        try {
            const productDocRef = doc(db, 'products', id);
            const productSnapshot = await getDoc(productDocRef);
            if (productSnapshot.exists()) {
                setProduct(productSnapshot.data());
            } else {
                console.error('Product not found.');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle input field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const productDocRef = doc(db, 'products', id);
            await updateDoc(productDocRef, product);
            alert('Product updated successfully.');
            navigate(`/product/${id}`); // Navigate back to product details page
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    if (loading) {
        return <p>Loading product details...</p>;
    }

    return (
        <div>
            <h1>Update Product</h1>
            <form onSubmit={handleUpdateProduct}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={product.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Category:</label>
                    <input
                        type="text"
                        name="category"
                        value={product.category}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Update Product</button>
            </form>
        </div>
    );
};

export default UpdateProduct;
