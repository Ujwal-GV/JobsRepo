import React, { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { loginValidationSchema, signupValidationSchema } from '../formikYup/ValidationSchema';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdEmail } from 'react-icons/md';
import { FaKey ,FaUser } from 'react-icons/fa';
import InputBox from '../components/InputBox';
import RoleChecker from '../components/RoleChecker';

function SignUp() {

  const roleData = ["Job Seeker" ,"Job Provider"]

  const [role, setRole] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();


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
    <div className="h-screen w-full center font-outfit">
       <Formik
        initialValues={{  email: "", password: "" ,name:""}}
        validationSchema={signupValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, values, touched, errors, isValid }) => (
          <Form className="bg-white w-[90%] md:w-[400px] shadow-lg shadow-black rounded-lg p-2 px-4 md:px-6 ">
            <div className="mt-4 flex justify-center items-center">
              {/* <img src="Logo.png" alt="Logo" className="w-12 h-12 mr-4" /> */}
              <span className="text-2xl md:text-2xl uppercase font-bold">Register</span>
            </div>
            <div className="mb-4 w-full">
              <hr className='m-4' />
              <label className="text-center block mb-2">Register As:</label>
              <div className="flex items-center justify-center mb-2 font-outfit">

                  {/* Set Selected Role onChange={(d)=>alert(JSON.stringify(d))} */}
                 <RoleChecker data={roleData} indicatorClassName='!bg-black rounded-full'/>
              </div>
            </div>
              
            <div className="mb-4 w-full">
              <InputBox
                key={"name"}
                name={"name"}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Enter FullName"
                type="text"
                customClass={touched.name && errors.name ? "input-error" : ""}
                value={values.name}
                icon={<FaUser />}
              />
              <ErrorMessage
                name="name"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4 w-full">
              <InputBox
                key={"email"}
                name={"email"}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Enter Email"
                type="email"
                customClass={touched.email && errors.email ? "input-error" : ""}
                value={values.email}
                icon={<MdEmail />}
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4 w-full">
              <InputBox
                key={"password"}
                name={"password"}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Enter Password"
                type="password"
                customClass={
                  touched.password && errors.password ? "input-error" : ""
                }
                value={values.password}
                icon={<FaKey />}
              />
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            {/* {errorMessage && <div className="text-red-500 text-center mb-2">{errorMessage}</div>} */}

            <button
              type="submit"
              className={"mb-4 flex mx-auto center w-[80%] p-3 btn-dark rounded-lg text-base "+(!isValid && "cursor-not-allowed"  )} 
            >
              Register
            </button>
             <hr />
            <p className="m-2 text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-black text-[1rem] hover:underline">
                Login
              </a>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignUp;
