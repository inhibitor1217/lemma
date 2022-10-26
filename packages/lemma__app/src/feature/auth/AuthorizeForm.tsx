import { Card } from '~/lib/component';
import { i18ntext } from '~/lib/i18n';
import { Sized, StackItem, VStack } from '~/lib/layout';
import { Text, Typography } from '~/lib/typography';
import AuthorizeFailedReason from './AuthorizeFailedReason';
import AuthorizeMethods from './AuthorizeMethods';

function FormTitle() {
  return (
    <VStack spacing={4} align="center">
      <StackItem>
        <Text as="h1" typo={Typography.Size24} bold color="txt-black-darkest">
          {i18ntext('LEMMA')}
        </Text>
      </StackItem>

      <StackItem>
        <Text as="h2" typo={Typography.Size18} color="txt-black-darkest">
          {i18ntext('Sign in to your account')}
        </Text>
      </StackItem>
    </VStack>
  );
}

export default function AuthorizeForm() {
  return (
    <Sized width={360}>
      <VStack spacing={16} align="stretch">
        <StackItem>
          <AuthorizeFailedReason />
        </StackItem>

        <StackItem>
          <Card padding={24}>
            <VStack spacing={16} align="center">
              <StackItem>
                <FormTitle />
              </StackItem>

              <StackItem marginBefore={24}>
                <AuthorizeMethods />
              </StackItem>
            </VStack>
          </Card>
        </StackItem>
      </VStack>
    </Sized>
  );
}
