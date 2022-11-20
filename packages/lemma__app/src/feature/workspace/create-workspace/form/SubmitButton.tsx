import { Button, ButtonSize } from '@channel.io/bezier-react';
import { useFormikContext } from 'formik';
import { i18nstring } from '~/lib/i18n';

export default function SubmitButton() {
  const { submitForm, isValid, isSubmitting } = useFormikContext();

  return (
    <Button
      type="submit"
      size={ButtonSize.L}
      onClick={submitForm}
      disabled={!isValid || isSubmitting}
      loading={isSubmitting}
      text={i18nstring('Create workspace')}
    />
  );
}
