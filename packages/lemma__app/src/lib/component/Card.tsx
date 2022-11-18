import { ArrowRightIcon, css, Icon, IconSize, styled, TransitionDuration } from '@channel.io/bezier-react';
import { PropsWithChildren } from 'react';

export namespace Card {
  const DEFAULT_PADDING_PX = 16;

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

  const Layout = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
  `;

  export const CTA = styled.div`
    position: absolute;
    top: 0;
    right: 0;
  `;

  export const Link = styled(Icon).attrs({
    source: ArrowRightIcon,
    size: IconSize.Normal,
    color: 'txt-black-darker',
  })``;

  export function Static({
    children,

    padding = DEFAULT_PADDING_PX,
  }: PropsWithChildren<{
    /**
     * @default 16
     */
    padding?: number;
  }>) {
    return (
      <Elevation style={{ padding }}>
        <Layout>{children}</Layout>
      </Elevation>
    );
  }

  const AnimatedElevation = styled(Elevation)<{
    disabled: boolean;
  }>`
    cursor: pointer;

    ${({ foundation }) => foundation?.transition.getTransitionsCSS(['box-shadow', 'transform'], TransitionDuration.M)}

    ${({ disabled }) =>
      disabled &&
      `
    cursor: not-allowed;
  `}

    &:hover {
      ${({ disabled }) =>
        !disabled &&
        `
        ${activeElevation}
        transform: translateY(-4px);
      `}
    }
  `;

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
        <Layout>{children}</Layout>
      </AnimatedElevation>
    );
  }
}
