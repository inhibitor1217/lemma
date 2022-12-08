import { Avatar, AvatarSize } from '@channel.io/bezier-react';
import { go, Option } from '@lemma/fx';
import { Card } from '~/lib/component';
import { i18ntext } from '~/lib/i18n';
import { HStack, Sized, StackItem, VStack } from '~/lib/layout';
import { Text, Typography } from '~/lib/typography';
import { useWorkspaceRoute, Workspace } from '~/lib/workspace';

export default function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  const routeToWorkspace = useWorkspaceRoute();

  return (
    <Sized height={160}>
      <Card.Interactive onClick={routeToWorkspace(workspace.id)}>
        <HStack align="stretch" spacing={8}>
          {go(
            workspace.profile,
            Option.flatMap((profile) => profile.photo),
            Option.map((photo) => (
              <StackItem>
                <Avatar name="workspace-profile-photo" size={AvatarSize.Size24} avatarUrl={photo} />
              </StackItem>
            ))
          )}

          <StackItem>
            <VStack spacing={4}>
              <StackItem>
                <Text typo={Typography.Size15} color="txt-black-darkest">
                  {go(
                    workspace.profile,
                    Option.map((profile) => profile.displayName),
                    Option.getOrElse(() => i18ntext('Untitled workspace'))
                  )}
                </Text>
              </StackItem>

              <StackItem>
                <Text typo={Typography.Size12} color="txt-black-darker">
                  {workspace.slug}
                </Text>
              </StackItem>
            </VStack>
          </StackItem>
        </HStack>

        <Card.CTA>
          <Card.Link />
        </Card.CTA>
      </Card.Interactive>
    </Sized>
  );
}
