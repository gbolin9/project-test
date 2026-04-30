'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [course, setCourse] = useState<any>(null);
    const [cleanID, setCleanID] = useState<string>("");

    useEffect(() => {
        async function fetchCourseData() {
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

    // Prevents crashing while data is loading
    if (!course) return <p>Loading...</p>;

    return (
        <main>
            <h1>{course.courseName}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="courseID">Course ID: </label>
                    <input id="courseID" type="text" name="courseID" value={course.courseID || ''} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="teacherID">Teacher ID: </label>
                    <input id="teacherID" type="number" name="teacherID" value={course.teacherID || ''} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="courseName">Course Name: </label>
                    <input id="courseName" type="text" name="courseName" value={course.courseName || ''} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="credits">Credits: </label>
                    <input id="credits" type="number" name="credits" value={course.credits || ''} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="description">Description: </label>
                    <textarea id="description" name="description" value={course.description || ''} onChange={handleChange} />
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={handleDelete}>Delete</button>
            </form>
        </main>
    );
}