import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { MdEmail } from "react-icons/md";
import { FaKey, FaUser } from "react-icons/fa";
import { signupValidationSchema } from "../formikYup/ValidationSchema";
import { useNavigate } from "react-router-dom";
import InputBox from "../components/InputBox";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axiosInstance";
import { LuLoader2 } from "react-icons/lu";

function UserSignUp() {
  const navigate = useNavigate();

  // Mutation for Job Seeker SignUp
  const SeekerSignUpMutation = useMutation({
    mutationKey: "seeker-signup",
    mutationFn: async (values) => {
      const res = await axiosInstance.post("/user/register", values);
      return res.data;
    },
    onSuccess: (data) => {
      alert(response);
      toast.success("Registration successful!");
      localStorage.setItem("authToken", data?.authToken);
      navigate("/");
    },
    onError: (error) => {
      const { message } = error.response.data;
      toast.error(message || "Signup failed. Please try again.");
    },
  });

  return (
    <div className="h-screen w-full center font-outfit">
      <Formik
        initialValues={{ email: "", password: "", name: "" }}
        validationSchema={signupValidationSchema}
        onSubmit={(values) => {
          SeekerSignUpMutation.mutate(values);
        }}
      >
        {({ handleChange, handleBlur, values, touched, errors, isValid }) => (
          <Form className="bg-white w-[90%] md:w-[400px] shadow-lg shadow-black rounded-lg p-2 px-4 md:px-6">
            <div className="mt-4 flex justify-center items-center">
                <span className="text-2xl text-white bg-black p-1 px-3 rounded-lg md:text-2xl uppercase font-bold">
                    User
                </span>
              <span className="text-2xl md:text-2xl uppercase font-bold">
                Registeration
              </span>
            </div>

            {/* Full Name Field */}
            <div className="mb-4 w-full">
                <hr className="m-4" />
              <InputBox
                key={"name"}
                name={"name"}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Enter Full Name"
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

            {/* Email */}
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

            {/* Password */}
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

            {/* Submit Button */}
            <button
              disabled={SeekerSignUpMutation.isPending}
              type="submit"
              className={
                "mb-4 flex mx-auto center w-[80%] p-3 btn-dark rounded-lg text-base " +
                (!isValid && "cursor-not-allowed")
              }
            >
              Register
              {SeekerSignUpMutation.isPending && (
                <LuLoader2 className="animate-spin-slow ml-2" />
              )}
            </button>
            <hr />
            <p className="m-2 text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <a href="/user/login" className="text-black text-[1rem] hover:underline">
                Login
              </a>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default UserSignUp;
