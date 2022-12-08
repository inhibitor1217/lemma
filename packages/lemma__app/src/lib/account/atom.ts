import { Option } from '@lemma/fx';
import { atom } from 'recoil';
import { RecoilAtom } from '~/lib/recoil';
import { Account } from './account';

export namespace AccountAtom {
  export const me = atom<Option<Account>>({
    key: RecoilAtom.makeKey('account', 'me'),
    default: Option.none(),
  });
}
