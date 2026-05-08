'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState<any[]>([]);
    const [studentID, setStudentID] = useState<string | null>(null);

    useEffect(() => {
        // Get Student ID
        setStudentID(localStorage.getItem('studentID'));

        // Load Cart from localStorage
        const savedCart = localStorage.getItem('courseCart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    const removeFromCart = (courseID: string) => {
        const updatedCart = cart.filter(item => item.courseID !== courseID);
        setCart(updatedCart);
        localStorage.setItem('courseCart', JSON.stringify(updatedCart));
    };

    const handleEnrollAll = async () => {
        if (!studentID) {
            alert("Please log in to enroll.");
            return;
        }

        try {
            // Fetch current student data to get existing courses
            const getResponse = await fetch(`https://backend-sdev-255-project.onrender.com/api/Students/${studentID}`);
            const studentData = await getResponse.json();
            const currentCourses = studentData.courses || [];

            // Extract IDs from cart and merge with current courses (preventing duplicates)
            const cartIDs = cart.map(c => c.courseID);
            const combinedCourses = Array.from(new Set([...currentCourses, ...cartIDs]));

            
            const response = await fetch(`https://backend-sdev-255-project.onrender.com/api/Students/${studentID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...studentData, courses: combinedCourses }),
            });

            if (response.ok) {
                alert("Enrollment successful!");
                localStorage.removeItem('courseCart'); 
                setCart([]);
                router.push('/studentcourse'); 
            } else {
                alert("Failed to enroll.");
            }
        } catch (error) {
            console.error("Enrollment Error:", error);
        }
    };

    if (cart.length === 0) {
        return (
            <main>
                <h1>Your Cart</h1>
                <p>Your cart is empty.</p>
                 <button onClick={() => router.push('/')}>Search for More Courses</button>
            </main>
        );
    }

    const totalCredits = cart.reduce((sum, item) => sum + (Number(item.credits) || 0), 0);

    return (
        <main>
            <h1>Enrollment Cart</h1>
            <table>
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>ID</th>
                        <th>Credits</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((course) => (
                        <tr key={course.courseID} >
                            <td>{course.courseName}</td>
                            <td >{course.courseID}</td>
                            <td>{course.credits}</td>
                            <td>
                                <button onClick={() => removeFromCart(course.courseID)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <h3>Total Credits: {totalCredits}</h3>
                <button 
                    onClick={handleEnrollAll}>
                    Confirm Courses and Enroll
                </button>
            </div>
        </main>
    );
}