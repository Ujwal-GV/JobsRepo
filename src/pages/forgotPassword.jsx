import React, { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import { forgotPasswordValidationSchema } from '../formikYup/ValidationSchema';
import InputBox from '../components/InputBox';
import { FaEnvelope } from 'react-icons/fa';
import { axiosInstance } from '../utils/axiosInstance';
import toast from 'react-hot-toast';

function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/user/forgot-password', {
        email: values.email,
      });

      if (response.status === 200) {
        toast.success(`Password reset link has been sent to: ${values.email}`,{duration:1000*6});
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to send reset link. Please try again.';
      toast.error(errorMsg)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Formik
        initialValues={{ email: '' }}
        validationSchema={forgotPasswordValidationSchema}
        onSubmit={handlePasswordReset}
      >
        {({ handleChange, handleBlur, values, touched, errors, isValid }) => (
          <Form className="bg-white w-[90%] md:w-[400px] shadow-lg shadow-black rounded-lg p-2 px-4 md:px-6">
            <div className="mt-4 flex justify-center items-center">
              <span className="text-2xl md:text-2xl font-bold">Forgot Password</span>
            </div>
            <hr className="m-4" />
            <p className="mb-4 text-gray-600 text-center">
              Please enter your email to receive a password reset link.
            </p>

            <div className="mb-4 w-full">
              <InputBox
                key={"email"}
                name={"email"}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Email"
                type="email"
                customClass={touched.email && errors.email ? "input-error" : ""}
                value={values.email}
                icon={<FaEnvelope />}
              />
              <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
            </div>

            <button
              type="submit"
              className={"mb-4 flex mx-auto center w-[80%] p-3 bg-black text-white rounded-lg text-base " + 
                (!isValid || loading ? "cursor-not-allowed" : "")}
              disabled={!isValid || loading}
            >
              {loading ? "Sending Reset Link..." : "Reset Password"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ForgotPassword;
