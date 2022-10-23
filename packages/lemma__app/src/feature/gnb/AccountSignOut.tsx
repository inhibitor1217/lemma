import { ListItem, ListItemVariant } from '@channel.io/bezier-react';
import { useNavigate } from 'react-router-dom';
import { useAuthSignOutMutation } from '~/lib/auth';
import { text } from '~/lib/i18n';
import { Text, Typography } from '~/lib/typography';
import { AuthorizePage } from '~/feature/auth';
import { InternalPath } from '~/page';
import { go, IO } from '~/lib/fx';

function useNavigateToAuthorizeRoute() {
  const navigate = useNavigate();

  return () => navigate(InternalPath.Authorize._query({ reason: AuthorizePage.AuthorizeFailedReason.SignOut }));
}

export default function AccountSignOut() {
  const { mutate: signOut } = useAuthSignOutMutation();
  const navigateToAuthorizeRoute = useNavigateToAuthorizeRoute();

  const handleClick = go(
    signOut,
    IO.flatMap(() => navigateToAuthorizeRoute)
  );

  return (
    <ListItem
      variant={ListItemVariant.Red}
      content={<Text typo={Typography.Size13}>{text('Sign out')}</Text>}
      onClick={() => IO.run(handleClick)}
    />
  );
}
