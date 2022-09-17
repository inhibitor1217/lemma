import { StackItem, VStack } from '~/lib/layout';
import GoogleIdentitySignInButton from './GoogleIdentitySignInButton';

export default function AuthorizeMethods() {
  return (
    <VStack spacing={8} align="center">
      <StackItem>
        <GoogleIdentitySignInButton />
      </StackItem>
    </VStack>
  );
}
