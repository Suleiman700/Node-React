import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CampaignView } from 'src/sections/campaign/view/campaign-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Campaigns - ${CONFIG.appName}`}</title>
      </Helmet>

      <CampaignView />
    </>
  );
}
