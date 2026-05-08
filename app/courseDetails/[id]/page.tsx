'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [course, setCourse] = useState<any>(null);
    const [cleanID, setCleanID] = useState<string>("");
    const [role, setRole] = useState<string | null>(null);

    interface Course {
    courseID: string;
    courseName: string;
    teacherID?: number;
    credits?: number;
    description?: string;
}

    useEffect(() => {
        async function fetchCourseData() {
            const storedRole = localStorage.getItem('role'); 
            setRole(storedRole);
            const resolvedParams = await params;
            // Extract and clean ID
            const idValue = decodeURIComponent(resolvedParams.id).replace('_id=', '');
            setCleanID(idValue);

            const response = await fetch(`https://backend-sdev-255-project.onrender.com/api/course/${idValue}`);
            const data = await response.json();
            setCourse(data);
        }
        fetchCourseData();
    }, [params]);

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      
      try {
        const response = await fetch(`https://backend-sdev-255-project.onrender.com/api/course/${cleanID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(course),
        });

        if (response.ok) {
          alert('Course added successfully!');
        } else {
          alert('Failed to save.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourse((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this course?")) return;
        
        const response = await fetch(`https://backend-sdev-255-project.onrender.com/api/course/${cleanID}`, {
            method: "DELETE",
        });

        if (response.ok) {
            router.push("/classadd");
        }
    }

   const handleAddCourse = () => {
   
    const rawCart = localStorage.getItem('courseCart');
    const existingCart: Course[] = rawCart ? JSON.parse(rawCart) : [];


    const isAlreadyInCart = existingCart.some((item: Course) => item.courseID === course.courseID);

    if (isAlreadyInCart) {
        alert("This course is already in your cart!");
        return;
    }

    //Add current course to the array
    const updatedCart: Course[] = [...existingCart, course];

    //Save and Alert
    localStorage.setItem('courseCart', JSON.stringify(updatedCart));
    alert(`${course.courseName} added to cart!`);
};
const handleDropCourse = async () => {
    const studentID = localStorage.getItem("studentID")
    if (!confirm("Do you want to drop this course?")) return;

    try {
    // Fetch the student's current data first to get their existing array
    const getResponse = await fetch(`https://backend-sdev-255-project.onrender.com/api/Students/${studentID}`);
    const studentData = await getResponse.json();

    //Filters to only delete the to be deleted course
    const currentCourses = studentData.courses || [];
    const updatedCourses = currentCourses.filter((id: string | number) => id !== course.courseID)

    //update with the new array without the deleted course
    const response = await fetch(`https://backend-sdev-255-project.onrender.com/api/Students/${studentID}`,{
        method: 'PUT',
        headers:{ 'Content-Type' : 'application/json'},
        body: JSON.stringify({ ...studentData, courses: updatedCourses }),

    });

    if (response.ok) {
      alert("Course dropped successfully.");
    } else {
      alert("Failed to drop course.");
    }
    } catch(error)
{
    alert("ERROR: There was in a issue with processing your request")
}



}

    // Prevents crashing while data is loading
    if (!course) return <p>Loading...</p>;

    const isStudent = role === 'student'

    return (
        <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-40 px-10 lg:items-start">
            <h1 className="text-3xl font-bold italic mb-4">{course.courseName}</h1>
            <form
            className= "max-w-md mx-auto p-6 bg-gray-500 shadow-md py-4 border-4 border-yellow-600" 
            onSubmit={handleSubmit}>
                <div className='font-bold py-2'>
                    <label htmlFor="courseID">Course ID: </label>
                    <input 
                    className='w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-4 focus:ring-blue-500'
                    id="courseID" 
                    type="text" 
                    name="courseID"
                    readOnly={isStudent}
                    value={course.courseID || ''} 
                    onChange={handleChange} required />
                </div>
                <div className='font-bold py-2'>
                    <label htmlFor="teacherID">Teacher ID: </label>
                    <input 
                    className='w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-4 focus:ring-blue-500'
                    id="teacherID" 
                    type="number" 
                    name="teacherID" 
                    readOnly={isStudent}
                    value={course.teacherID || ''} 
                    onChange={handleChange} />
                </div>
                <div className='font-bold py-2'>
                    <label htmlFor="courseName">Course Name: </label>
                    <input 
                    className='w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-4 focus:ring-blue-500'
                    id="courseName" 
                    type="text" 
                    name="courseName" 
                    readOnly={isStudent}
                    value={course.courseName || ''} 
                    onChange={handleChange} />
                </div>
                <div className='font-bold py-2'>
                    <label htmlFor="subjectArea">Subject Area: </label>
                    <input 
                    className='w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-4 focus:ring-blue-500'
                    id="subjectArea" 
                    type="text" 
                    name="subjectArea" 
                    readOnly={isStudent}
                    value={course.subjectArea || ''} 
                    onChange={handleChange} />
                </div>
                <div className='font-bold py-2'>
                    <label htmlFor="credits">Credits: </label>
                    <input
                    className='w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-4 focus:ring-blue-500'
                    id="credits" 
                    type="number" 
                    name="credits" 
                    readOnly={isStudent}
                    min="1"
                    max="5"
                    value={course.credits || ''} 
                    onChange={handleChange} />
                </div>
                <div className='font-bold py-2'>
                    <label htmlFor="description">Description: </label>
                    <textarea
                    className='w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-4 focus:ring-blue-500'
                    id="description" 
                    name="description" 
                    readOnly={isStudent}
                    value={course.description || ''} 
                    onChange={handleChange} />
                </div>
                {role !== 'student' && (
        <div className="button-group mx-auto flex space-x-4 py-4">
          <button
          className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700'
          type="submit">Save</button>
          <button
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
          type="button" 
          onClick={handleDelete} >
            Delete
          </button>
        </div>
        
      )}
      {role === 'student' && (
        <div className="button-group mx-auto flex space-x-4 py-4">
          <button 
          type="button" 
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-blue-700"
          onClick={handleAddCourse}>
            Add Course
          </button>
          <button 
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-red-600"
          type="button" onClick={handleDropCourse}>
            Drop Course
          </button>
        </div>
        
      )}
            </form>
        </main>
        </div>
    );
}