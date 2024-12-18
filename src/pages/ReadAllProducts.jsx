import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../config/firebaseConfig/firebaseConfig";
import { Link } from "react-router-dom";

const ReadAllProducts = () => {
    const [products, setProducts] = useState([]);

    const fetchAllProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            const productsArray = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(productsArray);
        } catch (error) {
            console.log("Error fetching products: ", error);
        }
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    return (
        <div>
            <h1>All Products</h1>
            {products.length > 0 ? (
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            <h3>{product.title}</h3>
                            <p>{product.description}</p>
                            <p>Category: {product.category}</p>
                            <p>Price: ${product.price}</p>
                            <Link to={`/product/${product.id}`}>
                                <button>Read More</button>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading products...</p>
            )}
        </div>
    );
};

export default ReadAllProducts;
