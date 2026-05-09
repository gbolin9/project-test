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

async function getData(): Promise<{ courses: Course[]; teachers: Teacher[] }> {
  const [courseRes, teacherRes] = await Promise.all([
    fetch("https://backend-sdev-255-project.onrender.com/api/course", { cache: 'no-store' }),
    fetch("https://backend-sdev-255-project.onrender.com/api/teacher", { cache: 'no-store' })
  ]);

  if (!courseRes.ok || !teacherRes.ok) {
    console.error(`Course Status: ${courseRes.status}, Teacher Status: ${teacherRes.status}`);
    throw new Error(`Failed to fetch: Courses ${courseRes.status}, Teachers ${teacherRes.status}`);
  }

  return {
    courses: await courseRes.json(),
    teachers: await teacherRes.json(),
  };
}

export default async function Home() {
  const { courses, teachers } = await getData();

  // Create a mapping of teacherID to their full name
  const teacherMap = new Map(
    teachers.map((t) => [t.teacherID, `${t.firstName} ${t.lastName}`])
  );

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center py-20 px-10">
        <h1 className="text-3xl font-bold mb-6">All Courses Provided Below</h1>
        
        <table className="w-full border-collapse border-4 border-yellow-600 bg-gray-500">
          <thead className="text-left text-xl italic text-white">
            <tr>
              <th className="p-3">Course ID</th>
              <th className="p-3">Teacher Name</th>
              <th className="p-3">Course Name</th>
              <th className="p-3">Credits</th>
              <th className="p-3">Subject Area</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="border-t border-yellow-600 text-white">
                <td className="p-3">
                  <Link 
                    className="px-2 py-1 bg-yellow-600 text-white rounded-sm hover:bg-green-500 transition-colors" 
                    href={`/courseDetails/${course._id}`}
                  >
                    {course.courseID}
                  </Link>
                </td>
                <td className="p-3">
                  {teacherMap.get(course.teacherID) || `ID: ${course.teacherID}`}
                </td>
                <td className="p-3">{course.courseName}</td>
                <td className="p-3">{course.credits}</td>
                <td className="p-3">{course.subjectArea}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
