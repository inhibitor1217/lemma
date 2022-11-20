import { FormLabel } from '@channel.io/bezier-react';
import { PropsWithChildren, ReactNode } from 'react';
import { Typography } from '~/lib/typography';

export default function FieldLabel({
  children,
  help,
}: PropsWithChildren<{
  help?: ReactNode;
}>) {
  return (
    <FormLabel typo={Typography.Size15} help={help}>
      {children}
    </FormLabel>
  );
}
