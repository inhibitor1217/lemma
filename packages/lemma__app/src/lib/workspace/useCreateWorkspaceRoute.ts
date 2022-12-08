import { IO } from '@lemma/fx';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { InternalPath } from '~/page';

export function useCreateWorkspaceRoute(): IO<void> {
  const navigate = useNavigate();

  return useCallback(() => navigate(InternalPath.App.Workspaces.Create._), []);
}
