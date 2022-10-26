import { styled, Text as BaseText, TextProps } from '@channel.io/bezier-react';
import { forwardRef, Ref } from 'react';

const StyledText = styled(BaseText)<{
  underline: boolean;
}>`
  ${({ underline }) => underline && 'text-decoration: underline;'}
`;

export default forwardRef(function Text(
  {
    underline = false,
    as,
    ...props
  }: TextProps & {
    /**
     * @default false
     */
    underline?: boolean;
  },
  ref: Ref<HTMLElement>
) {
  return <StyledText ref={ref} forwardedAs={as} underline={underline} {...props} />;
});
