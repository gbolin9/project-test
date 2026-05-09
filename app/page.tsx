import Link from "next/link";

interface Teacher {
  teacherID: number;
  firstName: string;
  lastName: string;
}

interface Course {
  _id: string;
  courseID: string;
  teacherID: number;
  courseName: string;
  credits: number;
  subjectArea: string;
}

async function getCourses(): Promise<Course[]> {
  const res = await fetch("https://backend-sdev-255-project.onrender.com/api/course", { cache: 'no-store' });
  if (!res.ok) return []; 
  return res.json();
}

async function getTeachers(): Promise<Teacher[]> {
  try {
    const res = await fetch("https://backend-sdev-255-project.onrender.com/api/teacher", { cache: 'no-store' });
    
    // Check if response is OK and actually JSON
    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType?.includes("application/json")) {
      console.error("Teacher API failed or returned HTML");
      return [];
    }
    
    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export default async function Home() {
  const [courses, teachers] = await Promise.all([getCourses(), getTeachers()]);

  const teacherMap = new Map(
    teachers.map((t) => [t.teacherID, `${t.firstName} ${t.lastName}`])
  );

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-40 px-10 lg:items-start">
        <h1 className="text-3xl font-bold mb-4">All Courses Provided Below</h1>
        <table className="w-full border-collapse border-4 border-yellow-600 bg-gray-500">
          <thead className="mx-auto text-left text-xl italic">
            <tr>
              <th>Course ID</th>
              <th>Teacher Name</th>
              <th>Course Name</th>
              <th>Credits</th>
              <th>Subject Area</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course._id}>
                  <td className="border px-2">
                    <Link
                      className="px-2 bg-yellow-600 text-white rounded-sm hover:bg-green-500"
                      href={`/courseDetails/${course._id}`}
                    >
                      {course.courseID}
                    </Link>
                  </td>
                  <td className="border px-2">{teacherMap.get(course.teacherID) || `ID: ${course.teacherID}`}</td>
                  <td className="border px-2">{course.courseName}</td>
                  <td className="border px-2">{course.credits}</td>
                  <td className="border px-2">{course.subjectArea}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="text-center py-4">No courses found or API is waking up...</td></tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}
