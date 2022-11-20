import { Card, Skeleton } from '~/lib/component';
import { Grid } from '~/lib/layout';
import { responsiveGridLayout } from './grid-layout';

export default function WorkspaceListSkeleton() {
  return (
    <Grid.Responsive numColumns={responsiveGridLayout.numColumns} rowHeight={responsiveGridLayout.rowHeight}>
      <Card.Static>
        <Skeleton.Profile />
      </Card.Static>

      <Card.Static>
        <Skeleton.Profile />
      </Card.Static>

      <Card.Static>
        <Skeleton.Profile />
      </Card.Static>
    </Grid.Responsive>
  );
}
