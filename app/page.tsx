import Link from 'next/link';
async function getCourse() {

  const res = await fetch("https://backend-sdev-255-project.onrender.com/api/course")
  return res.json();
}


export default async function Home() {
  const data = await getCourse();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <h1>Table Test</h1>
      <table>
        <thead>
          <tr>
          <th>courseID</th>
          <th>teacherID</th>
          <th>Course Name</th>
          <th>credits</th>
          </tr>
          </thead>
          <tbody>
            {data.map((course) =>(
              <tr key={course.id}>
                <td>
                 <Link href={`/courseDetails/${course._id}`}>
  View Details
</Link>
                </td>
                <td>{course.teacherID}</td>
                <td>{course.courseName}</td>
                <td>{course.credits}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

