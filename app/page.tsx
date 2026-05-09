import Link from 'next/link';

interface Course {
  _id: string;
  courseID: string;
  teacherID: number;
  courseName: string;
  credits: number;
  subjectArea: string;
}

interface Teacher {
  teacherID: number;
  firstName: string;
  lastName: string;
}

// Fetches both data sets
async function getData(): Promise<{ courses: Course[]; teachers: Teacher[] }> {
  const [courseRes, teacherRes] = await Promise.all([
    fetch("https://backend-sdev-255-project.onrender.com/api/course", { cache: 'no-store' }),
    fetch("https://backend-sdev-255-project.onrender.com/api/teacher", { cache: 'no-store' })
  ]);

  return {
    courses: await courseRes.json(),
    teachers: await teacherRes.json(),
  };
}

export default async function Home() {
  const { courses, teachers } = await getData();

  // Create a mapping of teacherID to their full name for easy display
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
              <th className="p-2">Course ID</th>
              <th className="p-2">Teacher Name</th>
              <th className="p-2">Course Name</th>
              <th className="p-2">Credits</th>
              <th className="p-2">Subject Area</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="border-t border-yellow-600">
                <td className="p-2">
                  <Link 
                    className="px-2 bg-yellow-600 text-white rounded-sm hover:bg-green-500" 
                    href={`/courseDetails/${course._id}`}
                  >
                    {course.courseID}
                  </Link>
                </td>
                <td className="p-2 text-white">
                  {teacherMap.get(course.teacherID) || "Unknown Teacher"}
                </td>
                <td className="p-2 text-white">{course.courseName}</td>
                <td className="p-2 text-white">{course.credits}</td>
                <td className="p-2 text-white">{course.subjectArea}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
