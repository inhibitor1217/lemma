import { styled } from '@channel.io/bezier-react';

export default styled.div`
  ${({ foundation }) => foundation?.elevation.ev3()}
  ${({ foundation }) => foundation?.rounding.round12}
`;
