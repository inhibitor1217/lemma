import { css, styled, TransitionDuration } from '@channel.io/bezier-react';
import { Children, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import ReactGridLayout, { Layout, Layouts, Responsive as ResponsiveGridLayout, WidthProvider } from 'react-grid-layout';
import { go } from '@lemma/fx';

const itemTransitionStyle = css<{
  animate: boolean;
}>`
  .react-grid-item {
    ${({ foundation, animate }) => animate && foundation?.transition.getTransitionsCSS(['transform'], TransitionDuration.M)}
  }
`;

const StaticGrid = styled(WidthProvider(ReactGridLayout))`
  ${itemTransitionStyle}
`;

const ResponsiveGrid = styled(WidthProvider(ResponsiveGridLayout))`
  ${itemTransitionStyle}
`;

const DEFAULT_MARGIN_PX = 16;

function gridLayout(numChildren: number, numColumns: number): Layout[] {
  return Array.from({ length: numChildren }).map((_, i) => ({
    i: i.toString(),
    x: i % numColumns,
    y: Math.floor(i / numColumns),
    w: 1,
    h: 1,
  }));
}

function useGridLayout(numChildren: number, numColumns: number): Layout[] {
  return useMemo(() => gridLayout(numChildren, numColumns), [numChildren, numColumns]);
}

function sanitizedMargin(margin?: number | [number, number]): [number, number] {
  function sanitizeValue(value: number) {
    if (Number.isNaN(value) || value < 0) {
      return DEFAULT_MARGIN_PX;
    }

    return value;
  }

  if (typeof margin === 'number') {
    return [sanitizeValue(margin), sanitizeValue(margin)];
  }

  if (Array.isArray(margin)) {
    return [sanitizeValue(margin[0]), sanitizeValue(margin[1])];
  }

  return [DEFAULT_MARGIN_PX, DEFAULT_MARGIN_PX];
}

export namespace Grid {
  /**
   * This prevents the transition of grid items
   * on first render.
   */
  function useAnimateAfterMount() {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
      setAnimate(true);
    }, []);

    return animate;
  }

  export function Static({
    children,

    numColumns,
    rowHeight,

    margin,
  }: PropsWithChildren<{
    numColumns: number;
    rowHeight: number;

    /**
     * @default 16
     */
    margin?: number | [number, number];
  }>) {
    const numChildren = Children.count(children);

    const animate = useAnimateAfterMount();

    return (
      <StaticGrid
        layout={useGridLayout(numChildren, numColumns)}
        cols={numColumns}
        isDraggable={false}
        isResizable={false}
        rowHeight={rowHeight}
        margin={sanitizedMargin(margin)}
        animate={animate}
      >
        {Children.toArray(children).map((child, i) => (
          <div key={`${i}`}>{child}</div>
        ))}
      </StaticGrid>
    );
  }

  export type ResponsiveBreakpoint = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

  const BREAKPOINTS_PX: Record<ResponsiveBreakpoint, number> = {
    xsmall: 0,
    small: 768,
    medium: 1080,
    large: 1440,
    xlarge: 1920,
  };

  export function Responsive({
    children,

    numColumns,
    rowHeight,

    margin,
  }: PropsWithChildren<{
    numColumns: Partial<Record<ResponsiveBreakpoint, number>>;
    rowHeight: number;

    /**
     * @default 16
     */
    margin?: number | [number, number] | Partial<Record<ResponsiveBreakpoint, number | [number, number]>>;
  }>) {
    const numChildren = Children.count(children);

    const breakpoints = useMemo(() => Object.keys(numColumns) as ResponsiveBreakpoint[], [numColumns]);

    const breakpointsPx = useMemo(
      () =>
        go(
          breakpoints,
          (breakpoints) => breakpoints.map((breakpoint) => [breakpoint, BREAKPOINTS_PX[breakpoint]] as const),
          Object.fromEntries
        ),
      [breakpoints]
    );

    const appliedLayouts = useMemo(() => {
      const layouts: Layouts = {};

      for (const breakpoint of breakpoints) {
        const cols = numColumns[breakpoint];
        if (cols === undefined) {
          console.warn('lib/layout/Grid:Responsive', 'unreachable code path. This might indicate a bug.');
          continue;
        }
        layouts[breakpoint] = gridLayout(numChildren, cols);
      }

      return layouts;
    }, [numChildren, breakpoints, numColumns]);

    const appliedMargins = useMemo(() => {
      if (typeof margin === 'number') {
        return sanitizedMargin(margin);
      }

      if (Array.isArray(margin)) {
        return sanitizedMargin(margin);
      }

      if (!margin) {
        return sanitizedMargin();
      }

      return Object.fromEntries(Object.entries(margin).map(([breakpoint, value]) => [breakpoint, sanitizedMargin(value)]));
    }, [margin]);

    const animate = useAnimateAfterMount();

    return (
      <ResponsiveGrid
        breakpoints={breakpointsPx}
        cols={numColumns}
        layouts={appliedLayouts}
        isDraggable={false}
        isResizable={false}
        rowHeight={rowHeight}
        margin={appliedMargins}
        animate={animate}
      >
        {Children.toArray(children).map((child, i) => (
          <div key={`${i}`}>{child}</div>
        ))}
      </ResponsiveGrid>
    );
  }
}
