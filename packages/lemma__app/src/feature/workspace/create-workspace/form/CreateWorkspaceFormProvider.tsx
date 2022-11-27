import { Formik } from 'formik';
import { PropsWithChildren } from 'react';
import { Workspace } from '~/lib/workspace';
import { createWorkspaceFormSchema, CreateWorkspaceFormValues, initialFormValues } from './create-workspace';

export default function CreateWorkspaceFormProvider({
  children,
  createWorkspace,
}: PropsWithChildren<{
  createWorkspace: (values: CreateWorkspaceFormValues) => Promise<Workspace>;
}>) {
  return (
    <Formik initialValues={initialFormValues} validationSchema={createWorkspaceFormSchema} onSubmit={createWorkspace}>
      {children}
    </Formik>
  );
}
