import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig/firebaseConfig";

const AllCourses = () => {
    const [courses, setCourses] = useState([]);

    const fetchCourses = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "courses"));
            const coursesList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCourses(coursesList);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const downloadBase64File = (base64Data, fileName) => {
        const link = document.createElement("a");
        link.href = base64Data;
        link.download = fileName;
        link.click();
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>All Courses</h1>
            {courses.length > 0 ? (
                courses.map((course) => (
                    <div key={course.id} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                        {course.thumbnailBase64 && (
                            <div>
                                <img
                                    src={course.thumbnailBase64}
                                    alt={`${course.title} Thumbnail`}
                                    style={{ width: "200px", marginBottom: "10px" }}
                                />
                                <button
                                    onClick={() => downloadBase64File(course.thumbnailBase64, `${course.title}-thumbnail.jpg`)}
                                >
                                    Download Thumbnail
                                </button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No courses available.</p>
            )}
        </div>
    );
};

export default AllCourses;
