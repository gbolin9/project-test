'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentRegistrationPage() {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    loginName: '',
    password: '',
  };

  const [student, setStudent] = useState(initialState);
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('https://backend-sdev-255-project.onrender.com/api/Students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
      });

      if (response.ok) {
        alert('You are successfully registered');
        router.push('/studentlogin')
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
            value={student.firstName}
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
            value={student.lastName}
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
            value={student.email}
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
            value={student.loginName}
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
            value={student.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}