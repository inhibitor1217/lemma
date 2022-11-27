import { FormControl, FormErrorMessage, TextField, TextFieldSize } from '@channel.io/bezier-react';
import { useField } from 'formik';
import { FieldLabel } from '~/feature/workspace/create-workspace/ui';
import { i18nstring, i18ntext } from '~/lib/i18n';
import { CreateWorkspaceFormValues } from './create-workspace';

export default function DisplayNameField() {
  const [inputProps, { error }] = useField<CreateWorkspaceFormValues['displayName']>('displayName');

  return (
    <FormControl hasError={!!error} labelPosition="left">
      <FieldLabel>{i18ntext('Display name')}</FieldLabel>
      <TextField size={TextFieldSize.L} placeholder={i18nstring('My workspace')} {...inputProps} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
}
