import { IO } from '@lemma/fx';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { InternalPath } from '~/page';

export function useWorkspacesRoute(): IO<void> {
  const navigate = useNavigate();

  return useCallback(() => navigate(InternalPath.App.Workspaces._), []);
}
