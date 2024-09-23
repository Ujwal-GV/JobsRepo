import React, { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { loginValidationSchema } from '../formikYup/ValidationSchema';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

            <h5 className="font-normal text-center mt-4 mb-4 pb-4 tracking-wide">Login to your account</h5>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={loginValidationSchema}
              
              onSubmit={(values) => {
                alert("Namskara Gaandu.....Hengidya!!");
              }}
            >
              {({ handleChange, handleBlur, values, touched, errors }) => (
                <Form>
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
                      { showPassword ? <EyeSlashIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" /> }
                    </button>
                    <ErrorMessage name="password" component="p" className='text-red-500 text-sm' />
                  </div>

                  <div className='flex justify-end'>
                  <a href="./forgotpassword" className="text-sm mb-3 text-gray-500">Forgot password?</a>
                  </div>

                  <button type="submit" className="mt-4 w-full p-3 bg-black text-white rounded-lg text-base">Login</button>
                </Form>
              )}
            </Formik>

            <p className="mt-8 text-gray-400">
              Don't have an account? <a href="signup" className="text-black">Register here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
