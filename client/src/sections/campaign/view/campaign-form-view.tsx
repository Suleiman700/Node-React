import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import {paths} from 'src/routes/paths';
import {UserService} from 'src/services/UserService';
import {CampaignForm} from '../campaign-form';
import {Iconify} from "../../../components/iconify";

// ----------------------------------------------------------------------

type Props = {
    campaignId?: string;
};

export function CampaignFormView({campaignId}: Props) {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [campaign, setCampaign] = useState(null);
    const isEditMode = !!campaignId;

    useEffect(() => {
        if (campaignId) {
            loadCampaign();
        }
    }, [campaignId]);

    const loadCampaign = async () => {
        try {
            setLoading(true);
            const response = await UserService.getCampaign(campaignId);
            if (response.status === 200) {
                setCampaign(response.data[0]);
            }
        } catch (error) {
            console.error('Error loading campaign:', error);
            setError('Failed to load campaign');
            navigate(paths.campaigns.list);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData: any) => {
        try {
            setLoading(true);
            setError('');

            const response = isEditMode
                ? await UserService.updateCampaign(campaignId, formData)
                : await UserService.createCampaign(formData);

            if (response.status === 200) {
                navigate(paths.campaigns.list);
            }
        } catch (error) {
            console.error('Error saving campaign:', error);
            setError('Failed to save campaign');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg">
            <Stack spacing={3}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Typography variant="h4">
                        {isEditMode ? 'Edit Campaign' : 'New Campaign'}
                    </Typography>

                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Iconify icon="eva:arrow-back-fill"/>}
                        onClick={() => navigate(paths.campaigns.list)}
                    >
                        Back to campaigns
                    </Button>

                </Stack>

                {error && (
                    <Alert severity="error" onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                <Card sx={{p: 3}}>
                    <CampaignForm
                        campaign={campaign}
                        onSubmit={handleSubmit}
                        loading={loading}
                    />
                </Card>
            </Stack>
        </Container>
    );
}
