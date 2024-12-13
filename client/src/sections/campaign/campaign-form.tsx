import * as Yup from 'yup';
import { ReactNode, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { CampaignService } from "../../services/CampaignService";
import RHFTextField from "src/components/hook-form/RHFTextField";
import FormProvider from 'src/components/hook-form/form-provider';
import Select from "@mui/material/Select";

// import 'src/assets/styles/sweetalert.css';

// ----------------------------------------------------------------------

const Schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    active: Yup.string().required('Active state is required'),
});

// ----------------------------------------------------------------------

type Props = {
    campaign?: any;
    onSubmit: (data: any) => void;
    loading?: boolean;
};

export function CampaignForm({ campaign, onSubmit, loading }: Props) {
    const [infoMessage, setInfoMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const methods = useForm({
        resolver: yupResolver(Schema),
    });

    const {
        reset,
        handleSubmit,
        control,
        formState: { isSubmitting },
        watch,
    } = methods;

    useEffect(() => {
        const subscription = watch(() => {
            if (infoMessage) setInfoMessage(null);
        });

        return () => subscription.unsubscribe();
    }, [watch, infoMessage]);

    useEffect(() => {
        reset(campaign || {});
    }, [campaign, reset]);

    const onSubmitForm = handleSubmit(async (data) => {
        try {
            if (campaign) {
                const result = await CampaignService.edit(campaign.id, data);
                if (result.status === 200) {
                    setInfoMessage({
                        type: 'success',
                        message: 'Campaign updated successfully!',
                    });
                } else if (result.status !== 200) {
                    setInfoMessage({
                        type: 'error',
                        message: result.data?.message || 'An error occurred while saving changes.',
                    });
                }
            } else {
                const createResult = await CampaignService.create(data);
                if (createResult.status === 201) {
                    await Swal.fire({
                        title: 'Campaign Created Successfully!',
                        html: `
                            <p>Your campaign token is:</p>
                            <div class="token-box">
                                <code class="token-text">${createResult.data.token}</code>
                            </div>
                            <p class="info-text">
                                You can use this token in your webhook
                            </p>
                        `,
                        icon: 'success',
                        confirmButtonText: 'Copy Token',
                        showCancelButton: true,
                        cancelButtonText: 'Close',
                        allowOutsideClick: false,
                        customClass: {
                            popup: 'swal2-popup',
                            title: 'swal2-title',
                            htmlContainer: 'swal2-html-container',
                            confirmButton: 'swal2-confirm',
                            cancelButton: 'swal2-cancel'
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigator.clipboard.writeText(createResult.data.token);
                            Swal.fire({
                                title: 'Token Copied!',
                                text: 'The token has been copied to your clipboard.',
                                icon: 'success',
                                timer: 1500,
                                showConfirmButton: false,
                                customClass: {
                                    popup: 'swal2-popup',
                                    title: 'swal2-title'
                                }
                            });
                        }
                    });

                    reset(campaign || {});
                    setInfoMessage({
                        type: 'success',
                        message: 'Campaign created successfully!',
                    });
                } else {
                    setInfoMessage({
                        type: 'error',
                        message: createResult.data?.message || 'An error occurred while saving changes.',
                    });
                }
            }
        } catch (error) {
            console.log(error);
            setInfoMessage({
                type: 'error',
                message: 'Unexpected error occurred. Please try again later.',
            });
        }
    });

    useEffect(() => {
        if (infoMessage) {
            const timer = setTimeout(() => {
                setInfoMessage(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [infoMessage]);

    return (
        <FormProvider methods={methods} onSubmit={onSubmitForm}>
            <Stack spacing={3}>
                <RHFTextField name="name" label="Campaign Name" />
                <RHFTextField 
                    name="token" 
                    label="Campaign Token" 
                    disabled={true} 
                    value={campaign ? campaign.token : 'Will be generated upon creating campaign'} 
                />
                <RHFTextField name="description" label="Description" multiline rows={4} />
                <Box>
                    <RHFTextField name="platform" label="Campaign Platform" />
                    <FormHelperText sx={{ px: 2, color: 'gray' }}>
                        Campaign platform like Facebook, TikTok, Instagram, etc.
                    </FormHelperText>
                </Box>
                <Controller
                    name="active"
                    control={control}
                    defaultValue={campaign?.active || "1"}
                    render={({ field }) => (
                        <Select {...field} fullWidth>
                            <MenuItem value="1">Active</MenuItem>
                            <MenuItem value="0">Inactive</MenuItem>
                        </Select>
                    )}
                />

                {infoMessage && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 2,
                            borderRadius: 1,
                            backgroundColor: infoMessage.type === 'error' ? 'error.light' : 'success.light',
                            color: infoMessage.type === 'error' ? 'error.main' : 'success.main',
                            mb: 2,
                            boxShadow: 2,
                        }}
                    >
                        {infoMessage.type === 'error' ? (
                            <Box sx={{ mr: 1 }}>
                                <WarningAmberIcon sx={{ color: 'error.main' }} />
                            </Box>
                        ) : (
                            <Box sx={{ mr: 1 }}>
                                <CheckCircleIcon sx={{ color: 'success.main' }} />
                            </Box>
                        )}
                        <Box>
                            <strong>{infoMessage.type === 'error' ? 'Error: ' : 'Success: '}</strong>
                            {infoMessage.message}
                        </Box>
                    </Box>
                )}

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || isSubmitting}
                    >
                        {campaign ? "Save Changes" : "Create Campaign"}
                    </Button>
                </Box>
            </Stack>
        </FormProvider>
    );
}
