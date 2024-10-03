import React, { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import { forgotPasswordValidationSchema } from '../formikYup/ValidationSchema';
import InputBox from '../components/InputBox';
import { FaEnvelope } from 'react-icons/fa';
import axios from 'axios';

function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8087/user/forgot-password', {
        email: values.email,
      });

      if (response.status === 200) {
        alert(`Password reset link has been sent to: ${values.email}`);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to send reset link. Please try again.';
      alert(errorMsg);
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
              {/* <img src="Logo.png" alt="Logo" className="w-12 h-12 mr-4" /> */}
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
