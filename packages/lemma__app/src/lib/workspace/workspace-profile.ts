import { PrimitiveType } from '~/lib/field';
import { Option } from '@lemma/fx';

export type WorkspaceProfile = {
  id: PrimitiveType.ID;
  createdAt: Date;
  updatedAt: Date;
  displayName: string;
  photo: Option<PrimitiveType.URL>;
  workspaceId: PrimitiveType.ID;
};
