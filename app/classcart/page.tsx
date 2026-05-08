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
            <main className= "min-h-screen flex flex-col items-center justify-start py-10">
      <h1 className='py-4 text-3xl justify-center italic'>Enrollment Cart</h1>
                <p>Your cart is empty.</p>
                 <button
                 className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-green-600'
                  onClick={() => router.push('/')}>Search for More Courses</button>
            </main>
        );
    }

    const totalCredits = cart.reduce((sum, item) => sum + (Number(item.credits) || 0), 0);

    return (
        <main className= "min-h-screen flex flex-col items-center justify-start py-10">
      <h1 className='py-4 text-3xl justify-center'>Enrollment Cart</h1>
            <table className="w-full border-collapse border-4 border-yellow-600 bg-gray-500">
        <thead className="mx-auto text-left text-xl italic">
                    <tr>
                        <th>Course Name</th>
                        <th>Course ID</th>
                        <th>Subject Area</th>
                        <th>Credits</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((course) => (
                        <tr key={course.courseID} >
                            <td>{course.courseName}</td>
                            <td >{course.courseID}</td>
                            <td >{course.subjectArea}</td>
                            <td>{course.credits}</td>
                            <td>
                                <button 
                                className='button-sm px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700'
                                onClick={() => removeFromCart(course.courseID)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <h3 className='text-xl font-bold'>Total Credits: {totalCredits}</h3>
                <div><button
                 className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-green-600'
                  onClick={() => router.push('/')}>Search for More Courses</button>
                    </div>
                    <div>
                <button
                className='mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-green-700'
                    onClick={handleEnrollAll}>
                    Confirm Courses and Enroll
                </button>
                </div>
            </div>
        </main>
    );
}