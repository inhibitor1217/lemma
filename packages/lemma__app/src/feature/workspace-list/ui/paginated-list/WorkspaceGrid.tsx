import { PropsWithChildren } from 'react';
import { Grid } from '~/lib/layout';
import { responsiveGridLayout } from './grid-layout';

export default function WorkspaceGrid({ children }: PropsWithChildren<{}>) {
  return (
    <Grid.Responsive numColumns={responsiveGridLayout.numColumns} rowHeight={responsiveGridLayout.rowHeight}>
      {children}
    </Grid.Responsive>
  );
}
