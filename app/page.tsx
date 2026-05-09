import Link from 'next/link';

// Interface definition for Course data
interface Course {
  _id: string;
  courseID: string;
  teacherID: number;
  courseName: string;
  credits: number;
  subjectArea: string;
}

// Fetches course data from the API with caching disabled (no-store)
async function getCourse(): Promise<Course[]> {
  const res = await fetch("https://backend-sdev-255-project.onrender.com/api/course", {
    cache: 'no-store'
  });
  return res.json();
}

// Server Component to render the courses
export default async function Home() {
  const data = await getCourse();

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-40 px-10 lg:items-start">
        <h1 className="text-3xl font-bold mb-4">All Courses Provided Below</h1>
        
        <table className="w-full border-collapse border-4 border-yellow-600 bg-gray-500">
          <thead className="mx-auto text-left text-xl italic">
            <tr>
              <th>Course ID</th>
              <th>Teacher ID</th>
              <th>Course Name</th>
              <th>Credits</th>
              <th>Subject Area</th>
            </tr>
          </thead>
          <tbody>
            {data.map((course) => (
              <tr key={course._id}>
                <td>
                  <Link 
                    className="px-2 bg-yellow-600 text-white rounded-sm hover:bg-green-500" 
                    href={`/courseDetails/${course._id}`}
                  >
                    {course.courseID}
                  </Link>
                </td>
                <td>{course.teacherID}</td>
                <td>{course.courseName}</td>
                <td>{course.credits}</td>
                <td>{course.subjectArea}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
