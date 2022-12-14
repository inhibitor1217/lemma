import { Avatar, AvatarSize, ellipsis } from '@channel.io/bezier-react';
import { Option } from '@lemma/fx';
import { selector, useRecoilValue } from 'recoil';
import { AccountAtom } from '~/lib/account';
import { i18ntext } from '~/lib/i18n';
import { HStack, Padding, Sized, StackItem, VStack } from '~/lib/layout';
import { RecoilAtom } from '~/lib/recoil';
import { Text, Typography } from '~/lib/typography';

const showAccountInfoEmail = selector({
  key: RecoilAtom.makeKey('GNBMyAccountMenu', 'showAccountInfoEmail'),
  get: ({ get }) => {
    const me = get(AccountAtom.me);
    return Option.isSome(me) && Option.isSome(me.email);
  },
});

function AccountInfoAvatar() {
  const me = useRecoilValue(AccountAtom.me);

  return <Avatar name={`account-avatar-${me?.id ?? '$nil'}`} avatarUrl={me?.photo ?? ''} size={AvatarSize.Size42} />;
}

function AccountInfoName() {
  const me = useRecoilValue(AccountAtom.me);

  return (
    <Text typo={Typography.Size16} bold color="txt-black-darkest">
      {me?.name ?? i18ntext('Unknown user')}
    </Text>
  );
}

function AccountInfoEmail() {
  const me = useRecoilValue(AccountAtom.me);

  return (
    <Text typo={Typography.Size13} color="txt-black-dark">
      {me?.email}
    </Text>
  );
}

export default function AccountInfo() {
  const showEmail = useRecoilValue(showAccountInfoEmail);

  return (
    <Sized width={240}>
      <Padding equal={8}>
        <HStack align="center" spacing={8}>
          <StackItem>
            <AccountInfoAvatar />
          </StackItem>

          <StackItem grow shrink weight={1} align="stretch" interpolation={ellipsis()}>
            <VStack justify="center">
              <StackItem>
                <AccountInfoName />
              </StackItem>

              {showEmail && (
                <StackItem style={{ maxWidth: '100%' }} interpolation={ellipsis()}>
                  <AccountInfoEmail />
                </StackItem>
              )}
            </VStack>
          </StackItem>
        </HStack>
      </Padding>
    </Sized>
  );
}
