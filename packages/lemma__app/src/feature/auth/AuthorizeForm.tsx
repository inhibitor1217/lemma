import { Card } from '~/lib/component';
import { text } from '~/lib/i18n';
import { Divider, Sized, StackItem, VStack } from '~/lib/layout';
import { Text, Typography } from '~/lib/typography';
import AuthorizeMethods from './AuthorizeMethods';

function FormTitle() {
  return (
    <VStack spacing={4} align="center">
      <StackItem>
        <Text as="h1" typo={Typography.Size24} bold color="txt-black-darkest">
          {text('LEMMA')}
        </Text>
      </StackItem>

      <StackItem>
        <Text as="h2" typo={Typography.Size18} color="txt-black-darkest">
          {text('Sign in to your account')}
        </Text>
      </StackItem>
    </VStack>
  );
}

function PolicyAgreementNotice() {
  return (
    <Text as="p" typo={Typography.Size13} color="txt-black-darker">
      {/**
       * @todo Add links to terms of service and privacy policy page.
       */}
      {text(`By logging in, you are agreeing to our terms of service and privacy policy.
Should fill this later. TODO`)}
    </Text>
  );
}

export default function AuthorizeForm() {
  return (
    <Sized width={360}>
      <Card padding={24}>
        <VStack spacing={16} align="center">
          <StackItem>
            <FormTitle />
          </StackItem>

          <StackItem marginBefore={24}>
            <AuthorizeMethods />
          </StackItem>

          <StackItem align="stretch">
            <Divider orientation="horizontal" withoutSideIndent />
          </StackItem>

          <StackItem align="stretch">
            <PolicyAgreementNotice />
          </StackItem>
        </VStack>
      </Card>
    </Sized>
  );
}
