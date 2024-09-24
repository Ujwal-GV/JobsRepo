import React, { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { signupValidationSchema } from '../formikYup/ValidationSchema';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('jobSeeker');
  // const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (values) => {
    // setErrorMessage('');
    try {
      const response = await axios.post('http://localhost:5000/user/register', {
        name: values.name,
        email: values.email,
        password: values.password,
        role,
      });

      if (response.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      if (error.response && error.response.data) {
        console.log(error.response.data.message);
        alert(error.response.data.message);
        // setErrorMessage(error.response.data.message || 'Signup failed. Please try again.');
      } else {
        console.log(error.response.data.message);
        alert(error.response.data.message);
        // setErrorMessage('Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="mt-20 flex justify-center">
      <div className="w-full max-w-lg bg-white shadow-lg">
        <div className="flex flex-row rounded-lg">
          <div className="w-full flex flex-col p-8">
            <div className="flex flex-row items-center justify-center mt-4">
              <img src="Logo.png" alt="Logo" className="w-12 h-12 mr-4" />
              <span className="text-4xl font-bold">Find_Jobs</span>
            </div>

            <h5 className="font-normal text-center mt-4 mb-4 pb-4 tracking-wide">Great way to start your journey</h5>

            <Formik
              initialValues={{ name: '', email: '', password: '' }}
              validationSchema={signupValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleChange, handleBlur, values, touched, errors }) => (
                <Form>
                  <div className="mb-4 w-full">
                    <label className="block mb-2">Register as:</label>
                    <div className="flex items-center justify-center mb-2">
                      <input
                        id="jobSeeker"
                        type="radio"
                        value="jobSeeker"
                        checked={role === 'jobSeeker'}
                        onChange={() => setRole('jobSeeker')}
                        className="mr-2 cursor-pointer"
                      />
                      <label htmlFor="jobSeeker" className="text-base mr-4">Job Seeker</label>
                      
                      <input
                        id="jobProvider"
                        type="radio"
                        value="jobProvider"
                        checked={role === 'jobProvider'}
                        onChange={() => setRole('jobProvider')}
                        className="mr-2 cursor-pointer"
                      />
                      <label htmlFor="jobProvider" className="text-base">Job Provider</label>
                    </div>
                  </div>

                  <div className="mb-4 w-full">
                    <label htmlFor="name" className="block mb-2">User name</label>
                    <input
                      id="name"
                      type="text"
                      className={`w-full p-3 text-base border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 ${touched.name && errors.name ? 'border-red-500' : ''}`}
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage name="name" component="p" className='text-red-500 text-sm' />
                  </div>

                  <div className="mb-4 w-full">
                    <label htmlFor="email" className="block mb-2">Email address</label>
                    <input
                      id="email"
                      type="email"
                      className={`w-full p-3 text-base border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 ${touched.email && errors.email ? 'border-red-500' : ''}`}
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage name="email" component="p" className='text-red-500 text-sm' />
                  </div>

                  <div className="mb-4 w-full relative">
                    <label htmlFor="password" className="block mb-2">Password</label>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className={`w-full p-3 text-base border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 ${touched.password && errors.password ? 'border-red-500' : ''}`}
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-11 text-gray-600"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-6 w-6" />
                      ) : (
                        <EyeIcon className="h-6 w-6" />
                      )}
                    </button>
                    <ErrorMessage name="password" component="p" className='text-red-500 text-sm' />
                  </div>

                  <button type="submit" className="mb-4 w-full p-3 bg-black text-white rounded-lg text-base">Sign Up</button>

                  {/* {errorMessage && <div className="text-red-500 text-center mb-2">{errorMessage}</div>} */}
                  
                </Form>
              )}
            </Formik>

            <p className="mt-8 text-gray-400">
              Already have an account? <a href="/login" className="text-black">Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
