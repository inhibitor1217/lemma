import { Banner, BannerVariant } from '@channel.io/bezier-react';
import { text } from '~/lib/i18n';
import { useSearchParams } from '~/lib/net/url';
import { Text, Typography } from '~/lib/typography';
import { AuthorizePage } from './authorize-page';

const REASON_DESCRPITIONS: Record<AuthorizePage.AuthorizeFailedReason, string> = {
  [AuthorizePage.AuthorizeFailedReason.NoSession]: 'You are not logged in. Please log in again.',
};

function AuthorizeFailedReasonBanner({ reason }: { reason: AuthorizePage.AuthorizeFailedReason }) {
  return (
    <Banner
      icon="error-triangle-filled"
      variant={BannerVariant.Orange}
      content={<Text typo={Typography.Size14}>{text(REASON_DESCRPITIONS[reason])}</Text>}
    />
  );
}

export default function AuthorizeFailedReason() {
  const [params] = useSearchParams<AuthorizePage.QueryParams>();

  if (params.reason) {
    return <AuthorizeFailedReasonBanner reason={params.reason} />;
  }

  return null;
}
