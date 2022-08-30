import { text } from '~/lib/i18n';
import { Divider, Sized, StackItem, VStack } from '~/lib/layout';
import { Text, Typography } from '~/lib/typography';
import AuthorizeMethods from './AuthorizeMethods';

function FormTitle() {
  return (
    <Text typo={Typography.Size24} bold color="txt-black-darkest">
      {text('Sign in to Lemma')}
    </Text>
  );
}

export default function AuthorizeForm() {
  return (
    <Sized width={360}>
      <VStack spacing={16} align="stretch">
        <StackItem>
          <FormTitle />
        </StackItem>

        <StackItem>
          <Divider orientation="horizontal" withoutSideIndent />
        </StackItem>

        <StackItem>
          <AuthorizeMethods />
        </StackItem>
      </VStack>
    </Sized>
  );
}
