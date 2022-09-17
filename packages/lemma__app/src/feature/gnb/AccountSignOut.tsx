import { ListItem, ListItemVariant } from '@channel.io/bezier-react';
import { useAuthSignOutMutation } from '~/lib/auth/useAuth';
import { text } from '~/lib/i18n';
import { Text, Typography } from '~/lib/typography';

export default function AccountSignOut() {
  const { mutate: signOut } = useAuthSignOutMutation();

  return (
    <ListItem
      variant={ListItemVariant.Red}
      content={<Text typo={Typography.Size13}>{text('Sign out')}</Text>}
      onClick={() => signOut()}
    />
  );
}
