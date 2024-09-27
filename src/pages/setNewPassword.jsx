import React, { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import { setNewPasswordValidationSchema } from '../formikYup/ValidationSchema';
import InputBox from '../components/InputBox';
import { FaKey } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function SetNewPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { token } = useParams();

  const handlePasswordReset = async (values, { setErrors }) => {
    setLoading(true);
    if (values.newPassword !== values.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/user/reset-password/${token}', {
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      if (response.status === 200) {
        alert('Password successfully reset!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error resetting password:', error.response?.data || error.message);
      alert('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Formik
        initialValues={{ newPassword: '', confirmPassword: '' }}
        validationSchema={setNewPasswordValidationSchema}
        onSubmit={handlePasswordReset}
      >
        {({ handleChange, handleBlur, values, touched, errors, isValid }) => (
          <Form className="bg-white w-[90%] md:w-[400px] shadow-lg shadow-black rounded-lg p-2 px-4 md:px-6">
            <div className="mt-4 flex justify-center items-center">
              {/* <img src="Logo.png" alt="Logo" className="w-12 h-12 mr-4" /> */}
              <span className="text-2xl md:text-2xl font-bold">Set New Password</span>
            </div>
            <hr className='m-4' />

            <div className="mb-4 w-full">
              <InputBox
                key={"newPassword"}
                name={"newPassword"}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Enter new password"
                type="password"
                customClass={touched.newPassword && errors.newPassword ? "input-error" : ""}
                value={values.newPassword}
                icon={<FaKey />}
              />
              <ErrorMessage
                name="newPassword"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4 w-full">
              <InputBox
                key={"confirmPassword"}
                name={"confirmPassword"}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Confirm new password"
                type="password"
                customClass={touched.confirmPassword && errors.confirmPassword ? "input-error" : ""}
                value={values.confirmPassword}
                icon={<FaKey />}
              />
              <ErrorMessage
                name="confirmPassword"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className={"mb-4 flex mx-auto center w-[80%] p-3 bg-black text-white rounded-lg text-base " + 
                (!isValid || loading ? "cursor-not-allowed" : "")}
              disabled={!isValid || loading}
            >
              {loading ? "Setting Password..." : "Set Password"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SetNewPassword;
