import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { forgotPasswordValidationSchema } from '../formikYup/ValidationSchema';

function ForgotPassword() {
  const initialValues = {
    email: '',
  };

  const handlePasswordReset = (values) => {
    alert(`Reset link sent to: ${values.email}`);
  };

  return (
    <div className="mt-20 flex justify-center">
      <div className="w-full rounded-lg max-w-lg bg-white shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4">Forgot Password</h2>
        <p className="mb-4 text-gray-600">Please enter your email to reset your password.</p>

        <Formik
          initialValues={initialValues}
          validationSchema={forgotPasswordValidationSchema}
          onSubmit={handlePasswordReset}
        >
          {({ handleChange, handleBlur, values }) => (
            <Form>
              <div className="mb-4 w-full">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-3 text-base border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                />
                <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
              </div>

              <button
                type="submit"
                className="w-full p-3 bg-black text-white rounded-lg text-base"
              >
                Reset Password
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default ForgotPassword;
