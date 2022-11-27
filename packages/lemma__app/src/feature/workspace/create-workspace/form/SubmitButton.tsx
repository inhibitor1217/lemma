import { Button, ButtonSize } from '@channel.io/bezier-react';
import { useFormikContext } from 'formik';
import { i18nstring } from '~/lib/i18n';

export default function SubmitButton() {
  const { submitForm, isValid, isSubmitting, isValidating } = useFormikContext();

  return (
    <Button
      type="submit"
      size={ButtonSize.L}
      onClick={submitForm}
      disabled={!isValid || isSubmitting || isValidating}
      loading={isSubmitting}
      text={i18nstring('Create workspace')}
    />
  );
}
