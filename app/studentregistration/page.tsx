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
    <main className= "min-h-screen flex flex-col items-center justify-start py-10">
      <h1 className="text-3xl py-2 italic">Student Registration</h1>
      <form 
      className="max-w-md mx-auto p-6 bg-gray-500 shadow-md py-4"
      onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
          <label htmlFor="firstName">First Name</label>
          <input
          className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-4 focus:ring-blue-500'
            id="firstName"
            type="text"
            name="firstName"
            value={student.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="lastName">Last Name</label>
          <input
          className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-4 focus:ring-blue-500'
            id="lastName"
            type="text"
            name="lastName"
            value={student.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="email">E-Mail</label>
          <input
          className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-4 focus:ring-blue-500'
            id="email"
            type="email"
            name="email"
            value={student.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="loginName">Login Name</label>
          <input
          className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-4 focus:ring-blue-500'
            id="loginName"
            type="text"
            name="loginName"
            value={student.loginName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="password">Create a Password</label>
          <input
          className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-4 focus:ring-blue-500'
            id="password"
            type="password"
            name="password"
            value={student.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex justify-center py-4">
          <button type="submit" className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}