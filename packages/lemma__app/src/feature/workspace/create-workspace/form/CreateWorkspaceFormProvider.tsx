import { styled } from '@channel.io/bezier-react';
import { Formik } from 'formik';
import { PropsWithChildren } from 'react';
import { Workspace } from '~/lib/workspace';
import { CreateWorkspaceFormValues, initialFormValues, validateCreateWorkspaceForm } from './create-workspace';

const Form = styled.form`
  width: 100%;
  height: 100%;
`;

export default function CreateWorkspaceFormProvider({
  children,
  createWorkspace,
}: PropsWithChildren<{
  createWorkspace: (values: CreateWorkspaceFormValues) => Promise<Workspace>;
}>) {
  return (
    <Formik
      initialValues={initialFormValues}
      validate={validateCreateWorkspaceForm}
      validateOnChange={false}
      validateOnBlur
      onSubmit={createWorkspace}
    >
      {({ handleSubmit }) => <Form onSubmit={handleSubmit}>{children}</Form>}
    </Formik>
  );
}
