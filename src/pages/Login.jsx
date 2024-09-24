import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { FaKey, FaUser } from "react-icons/fa";
import { signupValidationSchema } from "../formikYup/ValidationSchema";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputBox from "../components/InputBox";
import { MdEmail } from "react-icons/md";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("jobSeeker"); // Default role set to 'jobSeeker'
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setErrorMessage(""); // Reset error message on submit
    alert(JSON.stringify(values));
  };

  return (
    <div className="w-full h-screen max-w-[1600px] flex items-center justify-center">
      {/* Display error message */}
      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={signupValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, values, touched, errors, isValid }) => (
          <Form className="bg-white w-[300px] md:w-[400px] shadow-lg shadow-black rounded-lg p-2 px-6">
            <div className="flex justify-center items-center">
              <img src="Logo.png" alt="Logo" className="w-12 h-12 mr-4" />
              <span className="text-xl md:text-2xl font-bold">JOB SHINE</span>
            </div>
            <h5 className="text-center mb-4">
              Great way to start your journey
            </h5>
            <div className="mb-4 w-full">
              <label className="block mb-2">Register As:</label>
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
                name={"name"}
                type="text"
                onBlur={handleBlur}
                onChange={handleChange}
                customClass={touched.name && errors.name ? "input-error" : ""}
                icon={<FaUser />}
                placeholder="Enter username"
                key={"name"}
                value={values.name}
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
                placeholder="Enter email"
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

            <button
              type="submit"
              className={"mb-4 flex mx-auto center w-[80%] p-3 bg-black text-white rounded-lg text-base "+(!isValid && "cursor-not-allowed"  )} 
            >
              Sign Up
            </button>
             <hr />
            <p className="mt-2 text-center text-gray-400 text-sm">
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
