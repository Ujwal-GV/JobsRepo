
import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { FaKey, FaUser } from "react-icons/fa";
import { loginValidationSchema, signupValidationSchema } from "../formikYup/ValidationSchema";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputBox from "../components/InputBox";
import { MdEmail } from "react-icons/md";

function Login() {
  const [role, setRole] = useState("jobSeeker"); 
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setErrorMessage('');
    try {
      const response = await axios.post('http://localhost:5000/user/login', {
        email: values.email,
        password: values.password,
      });

      if (response.status === 200) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response && error.response.data) {
        // console.log(error.response.data.message);
        // alert(error.response.data.message);
        setErrorMessage(error.response.data.message || 'Signup failed. Please try again.');
      } else {
        // console.log(error.response.data.message);
        // alert(error.response.data.message);
        setErrorMessage('Signup failed. Please try again.');
      }
    }
  };


  return (
    <div className="w-full h-screen max-w-[1600px] flex items-center justify-center">
      <Formik
        initialValues={{  email: "", password: "" }}
        validationSchema={loginValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, values, touched, errors, isValid }) => (
          <Form className="bg-white w-[300px] md:w-[400px] shadow-lg shadow-black rounded-lg p-2 md:px-6 ">
            <div className="mt-4 flex justify-center items-center">
              {/* <img src="Logo.png" alt="Logo" className="w-12 h-12 mr-4" /> */}
              <span className="text-2xl md:text-2xl font-bold">LOGIN</span>
            </div>
            <div className="mb-4 w-full">
              <hr className="m-4"/>
              <div className="flex items-center justify-center mb-2">
                <input
                  id="jobSeeker"
                  type="radio"
                  value="jobSeeker"
                  checked={role === "jobSeeker"}
                  onChange={() => setRole("jobSeeker")}
                  className="mr-2 cursor-pointer"
                />
                <label htmlFor="jobSeeker" className="text-sm mr-4">
                  Job Seeker
                </label>

                <input
                  id="jobProvider"
                  type="radio"
                  value="jobProvider"
                  checked={role === "jobProvider"}
                  onChange={() => setRole("jobProvider")}
                  className="mr-2 cursor-pointer"
                />
                <label htmlFor="jobProvider" className="text-sm">
                  Job Provider
                </label>
              </div>
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

            <div className="mb-1 w-full">
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
            <p className="mb-4 text-end"><span className="text-sm cursor-pointer hover:underline me-3" onClick={()=>navigate("/forgotpassword")}>Forgot Password?</span></p>

            {errorMessage && <div className="text-red-500 text-center mb-2">{errorMessage}</div>}

            <button
              type="submit"
              className={"mb-4 flex mx-auto center w-[80%] p-3 btn-dark rounded-lg text-base "+(!isValid && "cursor-not-allowed"  )} 
            >
              Login
            </button>
             <hr />
            <p className="m-2 text-center text-gray-400 text-sm">
              Don't have an account? {" "}
              <a href="/signup" className="text-black text-[1rem] hover:underline">
                Register
              </a>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
