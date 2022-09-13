import {
  Avatar,
  AvatarSize,
  Button,
  ButtonColorVariant,
  ButtonSize,
  ButtonStyleVariant,
  OverlayPosition,
} from '@channel.io/bezier-react';
import { useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { AccountAtom } from '~/lib/account';
import { Dialog } from '~/lib/component';
import { useOverlay } from '~/lib/component-helper';
import GNBMyAccountMenu from './GNBMyAccountMenu';

const MY_ACCOUNT_MENU_OVERLAY_PROPS = {
  position: OverlayPosition.RightBottom,
  marginX: 16,
  withTransition: true,
};

export default function GNBMyAccountButton() {
  const me = useRecoilValue(AccountAtom.me);

  const ref = useRef<HTMLButtonElement | null>(null);
  const [GNBMyAccountMenuElement, showGNBMyAccountMenu, openGNBMyAccountMenu] = useOverlay(
    <Dialog>
      <GNBMyAccountMenu />
    </Dialog>,
    {
      target: ref.current,
      ...MY_ACCOUNT_MENU_OVERLAY_PROPS,
    }
  );

  return (
    <>
      <Button
        ref={ref}
        styleVariant={ButtonStyleVariant.Tertiary}
        colorVariant={ButtonColorVariant.MonochromeLight}
        size={ButtonSize.XL}
        leftContent={<Avatar name={`account-avatar-${me?.id ?? '$nil'}`} avatarUrl={me?.photo ?? ''} size={AvatarSize.Size30} />}
        active={showGNBMyAccountMenu}
        onClick={openGNBMyAccountMenu}
      />

      {GNBMyAccountMenuElement}
    </>
  );
}
