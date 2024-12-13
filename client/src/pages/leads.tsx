import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { LeadsView } from 'src/sections/leads/view/leads-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Leads - ${CONFIG.appName}`}</title>
      </Helmet>

      <LeadsView />
    </>
  );
}
