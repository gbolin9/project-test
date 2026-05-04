import Link from "next/link";

export default function teacherLoginPage() {
    
    return (
            <main>

                <h1>Teacher Login</h1>

                <form>
                    <label htmlFor="loginName">User Name: </label>
                    <input 
                    id="loginName"
                    type = "text"
                    name = "loginName"
                    />

                    <label htmlFor="password">Enter Password: </label>
                    <input
                    id="password"
                    type = "password"
                    name = "password"
                    />

                    <button type="submit">Login</button>
                </form>

                <p>If you are not registered click <Link href="/teacherregistration"> Here</Link></p>
                
            </main>
        );

    }