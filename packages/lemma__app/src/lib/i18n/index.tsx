import { Fragment, ReactNode } from 'react';

/**
 * @todo `text` indicates that the content requires translation later on.
 */
export const text = (str: string): ReactNode =>
  str.split('\n').reduce((nodes, line, index) => {
    if (nodes.length > 0) {
      nodes.push(<br key={`br-${index}`} />);
    }
    nodes.push(<Fragment key={`line-${index}`}>{line}</Fragment>);
    return nodes;
  }, [] as JSX.Element[]);
