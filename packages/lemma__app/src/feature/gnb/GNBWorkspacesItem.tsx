import { Button, ButtonColorVariant, ButtonSize, ButtonStyleVariant } from '@channel.io/bezier-react';
import { useLocation } from 'react-router-dom';
import { useWorkspacesRoute } from '~/lib/workspace';
import { InternalPath } from '~/page';

function useIsWorkspacesRoute() {
  const { pathname } = useLocation();
  return pathname === InternalPath.App.Workspaces._;
}

export default function GNBWorkspacesItem() {
  const isWorkspacesRoute = useIsWorkspacesRoute();
  const routeToWorkspaces = useWorkspacesRoute();

  return (
    <Button
      styleVariant={ButtonStyleVariant.Tertiary}
      colorVariant={ButtonColorVariant.MonochromeLight}
      size={ButtonSize.XL}
      leftContent="apps-filled"
      active={isWorkspacesRoute}
      onClick={routeToWorkspaces}
    />
  );
}
