import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});

export const signupValidationSchema = Yup.object().shape({
  name: Yup.string()
  .required('Name is required'),
  email: Yup.string()
  .email('Invalid email')
  .required('Email is required'),
  password: Yup.string()
  .min(8, 'Password must be at least 8 characters')
  .required('Password is required'),
});

export const setNewPasswordValidationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters long'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export const forgotPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
});