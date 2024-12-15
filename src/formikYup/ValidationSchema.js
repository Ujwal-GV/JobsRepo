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
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
  .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
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
    .email('Invalid email ')
    .required('Email is required'),
});

export const urlValidationSchema = Yup.object().shape({
  url: Yup.string()
    .url("Please enter a valid URL")
    .required("URL is required"),
});


export const userPersonalDetailsSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  mobile: Yup.string()
    .matches(/^\d{10}$/, "Mobile must be a 10-digit number")
    .required("Mobile number is required"),
  gender: Yup.string(),
});

export const mobileValidation = Yup.object().shape({
  mobile: Yup.string()
    .matches(/^\d{10}$/, "Mobile must be a 10-digit number")
    .required("Mobile number is required"),
});