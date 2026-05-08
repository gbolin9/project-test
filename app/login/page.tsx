import Link from "next/link";

export default function loginPage() {
    
    return (
            <main className="mx-auto py-10">
                <div className= "max-w-md mx-auto p-6 bg-gray-500 shadow-md py-4">

                <div className="py-4 justify-center items-center">
                    <h1 className="text-xl py-2">If you are a student click</h1>
                        <div className="flex justify-center py-2">
                        <Link 
                        className="px-10 py-2 bg-yellow-600 text-white rounded-md hover:bg-green-500 transition-colors italic" 
                        href="/studentlogin"> 
                        I'm A Student
                        </Link>
                        </div>
                </div>

                <div className="py-4 justify-center items-center">
                    <h1 className="text-xl py-2">If you are a teacher click</h1>
                        <div className="flex justify-center py-2">
                        <Link 
                        className="px-10 py-2 bg-blue-600 text-white rounded-md hover:bg-green-500 transition-colors italic" 
                        href="/teacherlogin">
                         I'm A Teacher
                        </Link>
                        </div>
                    </div>
                </div>
            </main>
        );

    }