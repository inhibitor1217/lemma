import { type Option } from '@lemma/fx';
import { type AuthProvider } from '@lemma/prisma-client';
import { type PrimitiveType } from '~/lib/field';

export type Account = {
  id: PrimitiveType.ID;
  createdAt: Date;
  updatedAt: Date;
  authProvider: AuthProvider;
  authProviderId: string;
  firstName: Option<string>;
  lastName: Option<string>;
  name: Option<string>;
  email: Option<PrimitiveType.Email>;
  photo: Option<PrimitiveType.URL>;
};
