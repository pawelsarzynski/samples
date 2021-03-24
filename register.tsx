import { useCallback } from 'react';
import { NextPage } from 'next';
import { Formik, FormikConfig } from 'formik';
import { mutate } from 'swr';
import * as Yup from 'yup';

import { RegisterForm, RegisterFormValues } from 'components';
import { registerUser } from 'api';

const initialValues: RegisterFormValues = {
  username: '',
  password: '',
};

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, 'Too Short!')
    .max(24, 'Too Long!')
    .required('Required'),
  password: Yup.string()
    .min(8, 'Too Short!')
    .max(50, 'Too Long!')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must contains letters and numbers')
    .required('Required'),
});

export const Register: NextPage = () => {
  const onSubmit = useCallback<FormikConfig<RegisterFormValues>['onSubmit']>(
    async (values) => {
      await mutate(null, registerUser(values));
    },
    [],
  );

  return (
    <Formik<RegisterFormValues>
      component={RegisterForm}
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={RegisterSchema}
    />
  );
};

export default Register;
