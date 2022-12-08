import { ListItem, ListItemVariant } from '@channel.io/bezier-react';
import { go, IO } from '@lemma/fx';
import { useNavigate } from 'react-router-dom';
import { AuthorizePage } from '~/feature/auth';
import { useAuthSignOutMutation } from '~/lib/auth';
import { i18ntext } from '~/lib/i18n';
import { Text, Typography } from '~/lib/typography';
import { InternalPath } from '~/page';

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
      content={<Text typo={Typography.Size13}>{i18ntext('Sign out')}</Text>}
      onClick={() => IO.run(handleClick)}
    />
  );
}
