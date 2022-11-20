import { i18ntext } from '~/lib/i18n';
import { Text, Typography } from '~/lib/typography';

export default function AllWorkspacesTitle() {
  return (
    <Text as="h1" typo={Typography.Size24} bold color="txt-black-darkest">
      {i18ntext('All workspaces')}
    </Text>
  );
}
