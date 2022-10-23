import { PrimitiveType } from '~/lib/field';
import { Option } from '~/lib/fx';
import { WorkspaceProfile } from './workspace-profile';

export type Workspace = {
  id: PrimitiveType.ID;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  profile: Option<WorkspaceProfile>;
};
