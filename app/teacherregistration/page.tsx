'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TeacherRegistrationPage() {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    loginName: '',
    password: '',
  };

  const [teacher, setTeacher] = useState(initialState);
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('https://backend-sdev-255-project.onrender.com/api/teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacher),
      });

      if (response.ok) {
        alert('You are successfully registered');
        router.push('/teacherlogin')
      } else {
        alert('Failed to save.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={teacher.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lasttName">Last Name</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={teacher.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">E-Mail</label>
          <input
            id="email"
            type="email"
            name="email"
            value={teacher.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="loginName">Login Name</label>
          <input
            id="loginName"
            type="text"
            name="loginName"
            value={teacher.loginName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Create a Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={teacher.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}