import { Children, useMemo, type PropsWithChildren } from 'react';
import ReactGridLayout, { Layout, WidthProvider } from 'react-grid-layout';

const StaticGrid = WidthProvider(ReactGridLayout);

const DEFAULT_MARGIN_PX = 16;

function useGridLayout(numChildren: number, numColumns: number): Layout[] {
  return useMemo(
    () =>
      Array.from({ length: numChildren }).map((_, i) => ({
        i: i.toString(),
        x: i % numColumns,
        y: Math.floor(i / numColumns),
        w: 1,
        h: 1,
      })),
    [numChildren, numColumns]
  );
}

export namespace Grid {
  export function Static({
    children,

    numColumns,
    rowHeight,

    margin,
    horizontalMargin,
    verticalMargin,
  }: PropsWithChildren<{
    numColumns: number;
    rowHeight: number;

    /**
     * @default 16
     */
    margin?: number;
    horizontalMargin?: number;
    verticalMargin?: number;
  }>) {
    const numChildren = Children.count(children);

    return (
      <StaticGrid
        layout={useGridLayout(numChildren, numColumns)}
        cols={numColumns}
        isDraggable={false}
        isResizable={false}
        rowHeight={rowHeight}
        margin={[margin ?? horizontalMargin ?? DEFAULT_MARGIN_PX, margin ?? verticalMargin ?? DEFAULT_MARGIN_PX]}
      >
        {Children.toArray(children).map((child, i) => (
          <div key={`${i}`}>{child}</div>
        ))}
      </StaticGrid>
    );
  }
}
