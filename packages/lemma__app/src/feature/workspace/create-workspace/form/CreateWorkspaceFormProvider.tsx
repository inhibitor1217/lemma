import { Formik } from 'formik';
import { PropsWithChildren } from 'react';
import { createWorkspaceFormSchema, CreateWorkspaceFormValues, initialFormValues } from './create-workspace';

export default function CreateWorkspaceFormProvider({
  children,
  createWorkspace,
}: PropsWithChildren<{
  createWorkspace: (values: CreateWorkspaceFormValues) => Promise<void>;
}>) {
  return (
    <Formik initialValues={initialFormValues} validationSchema={createWorkspaceFormSchema} onSubmit={createWorkspace}>
      {children}
    </Formik>
  );
}
