import Link from "next/link";

export default function loginPage() {
    
    return (
            <main>

                <h1>If you are a student click<Link href="/studentlogin"> Here</Link></h1>

                <h1>If you are a teacher click<Link href="/teacherlogin"> Here</Link></h1>
                
            </main>
        );

    }