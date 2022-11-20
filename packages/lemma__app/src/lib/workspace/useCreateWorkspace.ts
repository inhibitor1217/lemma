import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IO } from '~/lib/fx';
import { InternalPath } from '~/page';

export function useCreateWorkspace(): IO<void> {
  const navigate = useNavigate();

  return useCallback(() => navigate(InternalPath.App.Workspaces.Create._), []);
}
