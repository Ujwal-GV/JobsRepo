import React, { useState, useContext, useEffect } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { FaKey } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { loginValidationSchema } from "../formikYup/ValidationSchema";
import { useNavigate } from "react-router-dom";
import InputBox from "../components/InputBox";
import { AuthContext } from "../contexts/AuthContext";
import { axiosInstance } from "../utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { LuLoader2 } from "react-icons/lu";

function UserLogin() {
  const { setUserRole } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Job Seeker login mutation
  const loginJobSeeker = async (values) => {
    const res = await axiosInstance.post("/user/login", values);
    return res.data;
  };

  const SeekerLoginMutation = useMutation({
    mutationKey: "seeker-login",
    mutationFn: loginJobSeeker,
    onSuccess: (response) => {
      alert(response);
      localStorage.setItem("authToken", response);
      navigate(sessionStorage.getItem("location") || "/", { replace: true });
    },
    onError: (error) => {
      const { message } = error.response.data;
      toast.error(message);
    },
  });

  return (
    <div className="w-full h-screen max-w-[1600px] flex items-center justify-center font-outfit">
      <div className="bg-white w-[90%] md:w-[400px] shadow-lg shadow-black rounded-lg p-3 px-4 md:px-6 ">
        <div className="mt-4 flex justify-center items-center">
        <span className="text-2xl text-white bg-black p-1 px-3 rounded-lg md:text-2xl uppercase font-bold">
            User
        </span>
          <span className="text-2xl md:text-2xl font-bold">LOGIN </span>
        </div>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginValidationSchema}
          onSubmit={(values) => {
            SeekerLoginMutation.mutate(values);
          }}
        >
          {({ handleChange, handleBlur, values, touched, errors, isValid }) => (
            <Form>
              <div className="mb-4 w-full">
              <hr className="m-4" />
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

              {errorMessage && (
                <div className="text-red-500 text-center mb-2">
                  {errorMessage}
                </div>
              )}

              <button
                disabled={SeekerLoginMutation.isPending}
                type="submit"
                className={
                  "mb-4 flex mx-auto center w-[80%] p-3 btn-dark rounded-lg text-base " +
                  (!isValid && "cursor-not-allowed")
                }
              >
                <span>Login</span>
                {SeekerLoginMutation.isPending && (
                  <LuLoader2 className="animate-spin-slow " />
                )}
              </button>
              <hr />
              <p className="m-2 text-center text-gray-400 text-sm">
                Don't have an account?{" "}
                <a href="/user/signup" className="text-black text-[1rem] hover:underline">
                  Register
                </a>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default UserLogin;