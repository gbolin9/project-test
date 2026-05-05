"use client";

import { useState, useEffect } from 'react';


export default function Page() {
  // Define initial state so you can use it for resetting
  const initialState = {
    courseID: '',
    teacherID: 0,
    courseName: '',
    subjectArea: '',
    credits: 1,
    description: '',
  };

  const [course, setCourse] = useState(initialState);

  useEffect(() => {
    const teacherID = localStorage.getItem('teacherID'); 
    if (teacherID) {
      setCourse((prev) => ({
        ...prev,
        teacherID: Number(teacherID),
      }));
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const isNumeric = name === "credits" || name === "teacherID";
    setCourse((prev) => ({
      ...prev,
      [name]: isNumeric ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const response = await fetch('https://backend-sdev-255-project.onrender.com/api/course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });

      if (response.ok) {
        alert('Course added successfully!');
        // Resets form after submission
        setCourse(initialState); 
      } else {
        alert('Failed to save.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <main>
      <h1>Add Course</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="courseID">Course ID</label>
          <input id="courseID" 
          type="text" 
          name="courseID" 
          value={course.courseID} 
          onChange={handleChange} 
          required />
        </div>
        <div>
          <label htmlFor="courseName">Course Name</label>
          <input id="courseName" 
          type="text"
           name="courseName" 
           value={course.courseName} 
           onChange={handleChange} 
           required/>
        </div><div>
          <label htmlFor="subjectArea">Subject Area</label>
          <input id="subjectArea" 
          type="text"
           name="subjectArea" 
           value={course.subjectArea} 
           onChange={handleChange} 
           required/>
        </div>
        <div>
          <label htmlFor="credits">Credits</label>
          <input id="credits" 
          type="number" 
          name="credits"
          min="1"
          max="5"
          value={course.credits} 
          onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="teacherID">Teacher ID</label>
          <input
            id="teacherID"
            type="number"
            name="teacherID"
            value={course.teacherID}
            onChange={handleChange}
            readOnly 
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description" 
          name="description" 
          value={course.description} 
          onChange={handleChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}