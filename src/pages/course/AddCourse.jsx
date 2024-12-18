import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig/firebaseConfig";
import { useNavigate } from "react-router-dom";

const AddCourse = () => {
    const [course, setCourse] = useState({
        title: "",
        description: "",
        thumbnail: null,
        thumbnailBase64: "",
    });
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();

    // Protected routing logic
    useEffect(() => {
        const authToken = localStorage.getItem("user_idToken");
        if (!authToken) {
            navigate("/auth/login");
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "thumbnail") {
            const file = files[0];
            setCourse({ ...course, thumbnail: file });
            setThumbnailPreview(URL.createObjectURL(file));

            // Convert image to Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setCourse((prevState) => ({ ...prevState, thumbnailBase64: reader.result }));
            };
            reader.readAsDataURL(file);
        } else {
            setCourse({ ...course, [name]: value });
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();

        if (!course.thumbnail) {
            alert("Please upload a thumbnail image.");
            return;
        }

        setUploading(true);

        try {
            // Save the course data to Firestore
            const courseData = {
                title: course.title,
                description: course.description,
                thumbnailBase64: course.thumbnailBase64,
                createdAt: new Date(),
            };

            await addDoc(collection(db, "courses"), courseData);

            alert("Course added successfully!");
            setCourse({ title: "", description: "", thumbnail: null, thumbnailBase64: "" });
            setThumbnailPreview(null);
            setUploading(false);
        } catch (error) {
            console.error("Error adding course:", error);
            alert("Failed to add course. Please try again.");
            setUploading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Add Course</h1>
            <form onSubmit={handleAddCourse}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={course.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={course.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Thumbnail (Image):</label>
                    <input
                        type="file"
                        name="thumbnail"
                        accept="image/*"
                        onChange={handleChange}
                        required
                    />
                    {thumbnailPreview && (
                        <div>
                            <img
                                src={thumbnailPreview}
                                alt="Thumbnail Preview"
                                style={{ width: "200px", marginTop: "10px" }}
                            />
                        </div>
                    )}
                </div>
                <button type="submit" disabled={uploading}>
                    {uploading ? "Uploading..." : "Add Course"}
                </button>
            </form>
        </div>
    );
};

export default AddCourse;
