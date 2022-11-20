import { i18ntext } from '~/lib/i18n';
import { StackItem, VStack } from '~/lib/layout';
import { Text, Typography } from '~/lib/typography';

export default function CreateWorkspaceFormTitle() {
  return (
    <VStack spacing={16}>
      <StackItem>
        <Text as="h1" typo={Typography.Size24} bold color="txt-black-darkest">
          {i18ntext('Get started with a new workspace')}
        </Text>
      </StackItem>

      <StackItem>
        <Text typo={Typography.Size16} color="txt-black-darker">
          {i18ntext('A workspace is a place for a single localization project.')}
          <br />
          {i18ntext('Manage your localization keys, translations, and contributors in one place!')}
        </Text>
      </StackItem>
    </VStack>
  );
}
