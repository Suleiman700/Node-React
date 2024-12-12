import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { CampaignFormView } from 'src/sections/campaign/view/campaign-form-view';

// ----------------------------------------------------------------------

export default function CampaignFormPage() {
  const { id } = useParams();
  const isEditMode = !!id;

  return (
    <>
      <Helmet>
        <title>{`${isEditMode ? 'Edit' : 'New'} Campaign - ${CONFIG.appName}`}</title>
      </Helmet>

      <CampaignFormView campaignId={id} />
    </>
  );
}
