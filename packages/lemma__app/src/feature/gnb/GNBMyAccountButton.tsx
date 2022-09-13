import { Avatar, AvatarSize, Button, ButtonColorVariant, ButtonSize, ButtonStyleVariant } from '@channel.io/bezier-react';
import { useRecoilValue } from 'recoil';
import { AccountAtom } from '~/lib/account';

export default function GNBMyAccountButton() {
  const me = useRecoilValue(AccountAtom.me);

  return (
    <Button
      styleVariant={ButtonStyleVariant.Tertiary}
      colorVariant={ButtonColorVariant.MonochromeLight}
      size={ButtonSize.XL}
      leftContent={<Avatar name={`account-avatar-${me?.id ?? '$nil'}`} avatarUrl={me?.photo ?? ''} size={AvatarSize.Size30} />}
    />
  );
}
