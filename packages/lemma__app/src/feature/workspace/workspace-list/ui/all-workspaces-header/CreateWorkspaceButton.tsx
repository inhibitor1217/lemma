import { Button, ButtonSize } from '@channel.io/bezier-react';
import { i18nstring } from '~/lib/i18n';

export default function CreateWorkspaceButton({ createWorkspace }: { createWorkspace: () => void }) {
  return <Button size={ButtonSize.L} leftContent="plus" text={i18nstring('Add workspace')} onClick={createWorkspace} />;
}
