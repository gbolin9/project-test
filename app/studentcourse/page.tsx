"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';

interface Course {
  _id: string;
  courseID: string;
  teacherID: number;
  courseName: string;
  credits: number;
  subjectArea: string;
}

export default function StudentCoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const studentID = localStorage.getItem("studentID");

    if (!studentID) {
      setError("No student ID found.");
      setLoading(false);
      return;
    }

    const fetchCourses = async () => {
      try {
        //Get the student's record which contains the array of course IDs
        const studentResponse = await fetch(`https://backend-sdev-255-project.onrender.com/api/Students/${studentID}`);
        if (!studentResponse.ok) throw new Error("Student not found");
        
        const studentData = await studentResponse.json();
        const courseIDs: string[] = studentData.courses || [];

        //Map through those IDs and fetch the details for each one
        const courseDetailsPromises = courseIDs.map(async (courseID) => {
          const res = await fetch(`https://backend-sdev-255-project.onrender.com/api/course/${courseID}`);
          if (!res.ok) return null; // Handle missing course details gracefully
          return res.json();
        });

        // Wait for all course lookups to finish and filter out any null results
        const results = await Promise.all(courseDetailsPromises);
        setCourses(results.filter((course): course is Course => course !== null));

      } catch (err) {
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-40 px-10 lg:items-start">
      <h1 className="text-3xl font-bold mb-4">Your Enrolled Courses</h1>
      
      
        <table className="w-full border-collapse border-4 border-yellow-600 bg-gray-500">
          <thead className="mx-auto text-left text-xl italic">
            <tr >
              <th>Course ID</th>
              <th>Teacher ID</th>
              <th>Course Name</th>
              <th>Credits</th>
              <th>Subject Area</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course._id} >
                  <td>
                 <Link 
                 className="px-2 bg-yellow-600 text-white rounded-sm hover:bg-green-500"
                 href={`/courseDetails/${course._id}`}>
                    {course.courseID}
                    </Link>
                    </td>
                  <td >{course.teacherID}</td>
                  <td >{course.courseName}</td>
                  <td >{course.credits}</td>
                  <td>{course.subjectArea}</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} >
                  No courses found for this student.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      
    </main>
    </div>
  );
}