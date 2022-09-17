import { Divider } from '@channel.io/bezier-react';
import { ListMenu } from '~/lib/component';
import AccountInfo from './AccountInfo';
import AccountSignOut from './AccountSignOut';

export default function GNBMyAccountMenu() {
  return (
    <ListMenu>
      <AccountInfo />

      <Divider orientation="horizontal" />

      <AccountSignOut />
    </ListMenu>
  );
}
