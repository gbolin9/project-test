'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [course, setCourse] = useState<any>(null);
    const [cleanID, setCleanID] = useState<string>("");
    const [role, setRole] = useState<string | null>(null);

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

    const handleAddCourse = async () => {
  const studentID = localStorage.getItem('studentID'); 
  
  if (!studentID) {
    alert("Please log in as a student to add this course.");
    return;
  }

  try {
    // Fetch the student's current data first to get their existing array
    const getResponse = await fetch(`https://backend-sdev-255-project.onrender.com/api/Students/${studentID}`);
    const studentData = await getResponse.json();

    //Checks for duplicate courses
    const currentCourses = studentData.courses || [];
    if (currentCourses.includes(course.courseID)) {
      alert("You are already enrolled in this course.");
      return;
    }

    // Append the new course to the existing courses array
    const updatedCourses = [...currentCourses, course.courseID];

    // Send the PUT request with the updated array
    const response = await fetch(`https://backend-sdev-255-project.onrender.com/api/Students/${studentID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...studentData, courses: updatedCourses }),
    });

    if (response.ok) {
      alert(course.courseName + " successfully added to your courses.");
    } else {
      alert('Failed to enroll. Please try again.');
    }
  } catch (error) {
    console.error('Enrollment Error:', error);
    alert('An error occurred while adding the course.');
  }
};

const handleDropCourse = async () => {
    const studentID = localStorage.getItem("studentID")
    if (!confirm("Do you want to drop this course?")) return;

    try {
    // Fetch the student's current data first to get their existing array
    const getResponse = await fetch(`https://backend-sdev-255-project.onrender.com/api/Students/${studentID}`);
    const studentData = await getResponse.json();

    //Filerts to only delete the to be deleted course
    const currentCourses = studentData.course || [];
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
        <main>
            <h1>{course.courseName}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="courseID">Course ID: </label>
                    <input id="courseID" 
                    type="text" 
                    name="courseID"
                    readOnly={isStudent}
                    value={course.courseID || ''} 
                    onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="teacherID">Teacher ID: </label>
                    <input id="teacherID" 
                    type="number" 
                    name="teacherID" 
                    readOnly={isStudent}
                    value={course.teacherID || ''} 
                    onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="courseName">Course Name: </label>
                    <input id="courseName" 
                    type="text" 
                    name="courseName" 
                    readOnly={isStudent}
                    value={course.courseName || ''} 
                    onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="credits">Credits: </label>
                    <input id="credits" 
                    type="number" 
                    name="credits" 
                    readOnly={isStudent}
                    min="1"
                    max="5"
                    value={course.credits || ''} 
                    onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="description">Description: </label>
                    <textarea id="description" 
                    name="description" 
                    readOnly={isStudent}
                    value={course.description || ''} 
                    onChange={handleChange} />
                </div>
                {role !== 'student' && (
        <div className="button-group">
          <button type="submit">Save</button>
          <button type="button" onClick={handleDelete} >
            Delete
          </button>
        </div>
        
      )}
      {role === 'student' && (
        <div className="button-group">
          <button type="button" onClick={handleAddCourse}>
            Add Course
          </button>
          <button type="button" onClick={handleDropCourse}>
            Drop Course
          </button>
        </div>
        
      )}
            </form>
        </main>
    );
}