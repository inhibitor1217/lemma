import { css, styled, TransitionDuration } from '@channel.io/bezier-react';
import { PropsWithChildren } from 'react';

const defaultElevation = css`
  ${({ foundation }) => foundation?.elevation.ev3()};
`;

const activeElevation = css`
  ${({ foundation }) => foundation?.elevation.ev4()};
`;

const Elevation = styled.div`
  width: 100%;
  height: 100%;
  ${({ foundation }) => foundation?.rounding.round16}
  ${defaultElevation}
`;

const AnimatedElevation = styled(Elevation)<{
  disabled: boolean;
}>`
  cursor: pointer;

  ${({ foundation }) => foundation?.transition.getTransitionsCSS(['box-shadow'], TransitionDuration.M)}

  ${({ disabled }) =>
    disabled &&
    `
    cursor: not-allowed;
  `}

  &:hover {
    ${({ disabled }) => !disabled && activeElevation}
  }
`;

export namespace Card {
  const DEFAULT_PADDING_PX = 16;

  export function Static({
    children,

    padding = DEFAULT_PADDING_PX,
  }: PropsWithChildren<{
    /**
     * @default 16
     */
    padding?: number;
  }>) {
    return <Elevation style={{ padding }}>{children}</Elevation>;
  }

  export function Interactive({
    children,

    padding = DEFAULT_PADDING_PX,

    disabled = false,
    onClick,
  }: PropsWithChildren<{
    /**
     * @default 16
     */
    padding?: number;

    /**
     * @default false
     */
    disabled?: boolean;

    onClick?: () => void;
  }>) {
    return (
      <AnimatedElevation style={{ padding }} disabled={disabled} onClick={onClick}>
        {children}
      </AnimatedElevation>
    );
  }
}
