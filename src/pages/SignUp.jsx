import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { MdEmail } from "react-icons/md";
import { FaKey, FaUser, FaBuilding } from "react-icons/fa"; // Added FaBuilding icon for company
import { signupValidationSchema } from "../formikYup/ValidationSchema";
import { useNavigate } from "react-router-dom";
import InputBox from "../components/InputBox";
import RoleChecker from "../components/RoleChecker";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axiosInstance";
import { LuLoader2 } from "react-icons/lu";

function SignUp() {
  const roleData = ["Job Provider", "Freelancer"];
  const [role, setRole] = useState("Job Provider");
  const navigate = useNavigate();

  // Mutation for Freelancer SignUp
  const FreelancerSignUpMutation = useMutation({
    mutationKey: "freelancer-signup",
    mutationFn: async (values) => {
      const res = await axiosInstance.post("/freelancer/create", values);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Registration successful!");
      localStorage.setItem("authToken" ,data?.authToken)
      navigate("/freelancer");
    },
    onError: (error) => {
      const { message } = error.response.data;
      toast.error(message || "Signup failed. Please try again.");
    },
  });

  // Mutation for Job Provider SignUp
  const ProviderSignUpMutation = useMutation({
    mutationKey: "provider-signup",
    mutationFn: async (values) => {
      const res = await axiosInstance.post("/provider/create", values);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Registration successful!");
      localStorage.setItem("authToken" ,data?.authToken)
      navigate("/provider");
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
          const updatedValues = role === "Freelancer" 
            ? { ...values, name: values.name } 
            : { ...values, company_name: values.name, name: undefined };

          if (role === "Freelancer") {
            FreelancerSignUpMutation.mutate(updatedValues);
          } else {
            ProviderSignUpMutation.mutate(updatedValues);
          }
        }}
      >
        {({ handleChange, handleBlur, values, touched, errors, isValid }) => (
          <Form className="bg-white w-[90%] md:w-[400px] shadow-lg shadow-black rounded-lg p-2 px-4 md:px-6 ">
            <div className="mt-4 flex justify-center items-center">
              <span className="text-2xl md:text-2xl uppercase font-bold">
                Register
              </span>
            </div>

            <div className="mb-4 w-full">
              <hr className="m-4" />
              <label className="text-center block mb-2">Register As:</label>
              <div className="flex items-center justify-center mb-2 font-outfit">
                {/* Set Selected Role */}
                <RoleChecker
                  data={roleData}
                  onChange={({ selectedData }) => setRole(selectedData)}
                  indicatorClassName="!bg-black rounded-full"
                />
              </div>
            </div>

            {/* Dynamic Name/Company Name Field */}
            <div className="mb-4 w-full">
              <InputBox
                key={"name"}
                name={"name"}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder={
                  role === "Freelancer"
                    ? "Enter Full Name"
                    : "Enter Company Name"
                }
                type="text"
                customClass={touched.name && errors.name ? "input-error" : ""}
                value={values.name}
                icon={role === "Freelancer" ? <FaUser /> : <FaBuilding />}
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
              disabled={
                FreelancerSignUpMutation.isPending ||
                ProviderSignUpMutation.isPending
              }
              type="submit"
              className={
                "mb-4 flex mx-auto center w-[80%] p-3 btn-dark rounded-lg text-base " +
                (!isValid && "cursor-not-allowed")
              }
            >
              Register
              {(FreelancerSignUpMutation.isPending ||
                ProviderSignUpMutation.isPending) && (
                  <LuLoader2 className="animate-spin-slow " />
              )}
            </button>
            <hr />
            <p className="m-2 text-center text-gray-400 text-sm">
              Already have an account?
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