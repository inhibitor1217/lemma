import { Card, Skeleton } from '~/lib/component';

export default function WorkspaceSkeleton() {
  return (
    <Card.Static>
      <Skeleton.Profile />
    </Card.Static>
  );
}
