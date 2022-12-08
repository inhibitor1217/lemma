import { Option } from '@lemma/fx';
import { PrimitiveType } from '~/lib/field';

export type WorkspaceProfile = {
  id: PrimitiveType.ID;
  createdAt: Date;
  updatedAt: Date;
  displayName: string;
  photo: Option<PrimitiveType.URL>;
  workspaceId: PrimitiveType.ID;
};
