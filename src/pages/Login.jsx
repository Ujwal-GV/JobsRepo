import React, { useState, useContext } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { FaKey } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { loginValidationSchema } from "../formikYup/ValidationSchema";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputBox from "../components/InputBox";
import RoleChecker from "../components/RoleChecker";
import { AuthContext } from "../contexts/AuthContext";

function Login() {
  const { setUserRole } = useContext(AuthContext);
  const roleData = ["Job Seeker", "Job Provider"];
  const [role, setRole] = useState("Job Seeker");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setErrorMessage("");
    try {
      const response = await axios.post("http://localhost:5000/user/login", {
        email: values.email,
        password: values.password,
      });

      if (response.status === 200) {
        setUserRole(role);
        {/* Redirect based on role */}
        if (role === "Job Provider") {
          navigate("/select-role");
        } else {
          navigate("/user");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Login failed. Please try again.");
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="w-full h-screen max-w-[1600px] flex items-center justify-center">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, values, touched, errors, isValid }) => (
          <Form className="bg-white w-[90%] md:w-[400px] shadow-lg shadow-black rounded-lg p-3 px-4 md:px-6 ">
            <div className="mt-4 flex justify-center items-center">
              <span className="text-2xl md:text-2xl font-bold">LOGIN</span>
            </div>
            <div className="mb-4 w-full">
              <hr className="m-4" />
              <div className="flex items-center justify-center mb-2">
                {/* Set Selected Role */}
                <RoleChecker
                  data={roleData}
                  onChange={({ selectedData }) => setRole(selectedData)}
                  indicatorClassName="!bg-black rounded-full"
                />
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
              <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
            </div>

            <div className="mb-1 w-full">
              <InputBox
                key={"password"}
                name={"password"}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Enter Password"
                type="password"
                customClass={touched.password && errors.password ? "input-error" : ""}
                value={values.password}
                icon={<FaKey />}
              />
              <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
            </div>
            <p className="mb-4 text-end">
              <span
                className="text-sm cursor-pointer hover:underline me-3"
                onClick={() => navigate("/forgotpassword")}
              >
                Forgot Password?
              </span>
            </p>

            {errorMessage && <div className="text-red-500 text-center mb-2">{errorMessage}</div>}

            <button
              type="submit"
              className={"mb-4 flex mx-auto center w-[80%] p-3 btn-dark rounded-lg text-base " + (!isValid && "cursor-not-allowed")}
            >
              Login
            </button>
            <hr />
            <p className="m-2 text-center text-gray-400 text-sm">
              Don't have an account?{" "}
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
