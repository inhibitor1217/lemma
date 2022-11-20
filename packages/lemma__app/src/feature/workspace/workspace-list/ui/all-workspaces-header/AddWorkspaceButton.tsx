import { Button, ButtonSize } from '@channel.io/bezier-react';
import { Link } from 'react-router-dom';
import { i18nstring } from '~/lib/i18n';

export default function AddWorkspaceButton({ addWorkspace }: { addWorkspace: () => void }) {
  return (
    <Link to=".">
      <Button size={ButtonSize.L} leftContent="plus" text={i18nstring('Add workspace')} onClick={addWorkspace} />
    </Link>
  );
}
