import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimitiveType } from '~/lib/field';
import { IO } from '@lemma/fx';
import { InternalPath } from '~/page';

export function useWorkspaceRoute(): (workspaceId: PrimitiveType.ID) => IO<void> {
  const navigate = useNavigate();

  return useCallback((workspaceId: PrimitiveType.ID) => () => navigate(InternalPath.App.Workspace(workspaceId)._), []);
}
