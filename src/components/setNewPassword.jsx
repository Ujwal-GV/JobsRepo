import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { setNewPasswordValidationSchema } from '../formikYup/ValidationSchema';

function setNewPassword() {
  const initialValues = {
    newPassword: '',
    confirmPassword: '',
  };

  const handlePasswordReset = (values) => {
    alert('Password successfully reset!');
  };

  return (
    <div className="mt-20 flex justify-center">
      <div className="w-full rounded-lg max-w-lg bg-white shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4">Set New Password</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={setNewPasswordValidationSchema}
          onSubmit={handlePasswordReset}
        >
          {({ handleChange, handleBlur, values }) => (
            <Form>
              <div className="mb-4 w-full">
                <label htmlFor="newPassword" className="block mb-2">New Password</label>
                <Field
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  className="w-full p-3 text-base border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                />
                <ErrorMessage name="newPassword" component="p" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4 w-full">
                <label htmlFor="confirmPassword" className="block mb-2">Confirm New Password</label>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="w-full p-3 text-base border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                />
                <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-sm" />
              </div>

              <button
                type="submit"
                className="w-full p-3 bg-black text-white rounded-lg text-base"
              >
                Set Password
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default setNewPassword;
