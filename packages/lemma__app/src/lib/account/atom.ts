import { atom } from 'recoil';
import { Option } from '~/lib/fx';
import { RecoilAtom } from '~/lib/recoil';

export namespace AccountAtom {
  export const me = atom<Option<unknown>>({
    key: RecoilAtom.makeKey('account', 'me'),
    default: Option.none(),
  });
}
