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
    <main className= "min-h-screen flex flex-col items-center justify-start py-10">
      <h1 className='py-4 text-3xl italic justify-center'>Add Course</h1>
      <div className="py-8 flex flex-col items-center justify-center text-2xl">
      <form 
      className= "max-w-md mx-auto p-6 bg-gray-500 shadow-md py-4 border-4 border-yellow-500 rounded-md"
      onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
          <label htmlFor="courseID">Course ID</label>
          <input 
          className='w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-4 focus:ring-blue-500'
          id="courseID" 
          type="text" 
          name="courseID" 
          value={course.courseID} 
          onChange={handleChange} 
          required />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="courseName">Course Name</label>
          <input 
          className='w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-4 focus:ring-blue-500'
          id="courseName" 
          type="text"
           name="courseName" 
           value={course.courseName} 
           onChange={handleChange} 
           required/>
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="subjectArea">Subject Area</label>
          <input 
          className='w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-4 focus:ring-blue-500'
          id="subjectArea" 
          type="text"
           name="subjectArea" 
           value={course.subjectArea} 
           onChange={handleChange} 
           required/>
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="credits">Credits</label>
          <input 
          className='w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-4 focus:ring-blue-500'
          id="credits" 
          type="number" 
          name="credits"
          min="1"
          max="5"
          value={course.credits} 
          onChange={handleChange} />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="teacherID">Teacher ID</label>
          <input
            className='w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-4 focus:ring-blue-500'
            id="teacherID"
            type="number"
            name="teacherID"
            value={course.teacherID}
            onChange={handleChange}
            readOnly 
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="description">Description</label>
          <textarea 
            className='w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-4 focus:ring-blue-500'
            id="description" 
            name="description" 
            value={course.description} 
            onChange={handleChange} />
        </div>
        <div className="flex justify-center py-4">
        <button 
        className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-green-500'
        type="submit">Submit</button>
        </div>
      </form>
      </div>
    </main>
  );
}