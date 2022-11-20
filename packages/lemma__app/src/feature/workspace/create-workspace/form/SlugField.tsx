import { FormControl, FormErrorMessage, TextField, TextFieldSize } from '@channel.io/bezier-react';
import { useField } from 'formik';
import { useState } from 'react';
import { FieldLabel } from '~/feature/workspace/create-workspace/ui';
import { i18ntext } from '~/lib/i18n';
import { random } from '~/lib/string';
import { Text, Typography } from '~/lib/typography';
import { CreateWorkspaceFormValues } from './create-workspace';

function SlugFieldTooltip() {
  return (
    <Text typo={Typography.Size13}>
      {i18ntext('Workspace slug is an identifier for your workspace.\nIt should be unique along all workspaces.')}
    </Text>
  );
}

export default function SlugField() {
  const [{ value, onChange }, { error }] = useField<CreateWorkspaceFormValues['slug']>('slug');

  const [placeholder] = useState(() => `my-workspace-${random.alphanumeric(6).toLowerCase()}`);

  return (
    <FormControl labelPosition="left" hasError={!!error}>
      <FieldLabel help={<SlugFieldTooltip />}>{i18ntext('Slug')}</FieldLabel>
      <TextField size={TextFieldSize.L} value={value} onChange={onChange('slug')} placeholder={placeholder} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
}
