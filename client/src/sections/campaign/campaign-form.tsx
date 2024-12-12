import * as Yup from 'yup';
import { ReactNode, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { CampaignService } from "../../services/CampaignService";

import RHFTextField from "src/components/hook-form/RHFTextField";
import FormProvider from 'src/components/hook-form/form-provider';
import Select from "@mui/material/Select";

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
    const [infoMessage, setInfoMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null); // Custom state for info messages

    const methods = useForm({
        resolver: yupResolver(Schema),
    });

    const {
        reset,
        handleSubmit,
        control,
        formState: { isSubmitting },
        watch, // Watch form fields for changes
    } = methods;

    // Watch all form fields and reset infoMessage when any field changes
    useEffect(() => {
        const subscription = watch(() => {
            if (infoMessage) setInfoMessage(null); // Clear infoMessage when any field is edited
        });

        return () => subscription.unsubscribe(); // Cleanup subscription
    }, [watch, infoMessage]);

    useEffect(() => {
        reset(campaign || {}); // Dynamically reset based on provided data
    }, [campaign, reset]);

    const onSubmitForm = handleSubmit(async (data) => {
        try {
            const result = await CampaignService.edit(campaign.id, data);

            if (result.status === 200) {
                // Success message
                setInfoMessage({
                    type: 'success',
                    message: 'Campaign updated successfully!',
                });
            } else if (result.status !== 200) {
                // Handle field-specific errors
                if (result.data?.message) {
                    setInfoMessage({
                        type: 'error',
                        message: result.data.message as string,
                    });
                } else {
                    // General error
                    setInfoMessage({
                        type: 'error',
                        message: 'An error occurred while saving changes.',
                    });
                }
            }
        } catch (error) {
            setInfoMessage({
                type: 'error',
                message: 'Unexpected error occurred. Please try again later.',
            });
        }
    });

    useEffect(() => {
        if (infoMessage) {
            // Automatically dismiss infoMessage after 3 seconds
            const timer = setTimeout(() => {
                setInfoMessage(null);
            }, 3000);

            return () => clearTimeout(timer); // Clear the timer if component is unmounted or infoMessage changes
        }
    }, [infoMessage]);

    return (
        <FormProvider methods={methods} onSubmit={onSubmitForm}>
            <Stack spacing={3}>
                <RHFTextField name="name" label="Campaign Name" />
                <RHFTextField name="token" label="Campaign Token" disabled={true} value={campaign? campaign.token:'Will be generated upon creating campaign'} />
                <RHFTextField name="description" label="Description" multiline rows={4} />
                <Controller
                    name="active"
                    control={control}
                    defaultValue={campaign?.active || "1"} // Fallback to "1" if not provided
                    render={({ field }) => (
                        <Select {...field} fullWidth>
                            <MenuItem value="1">Active</MenuItem>
                            <MenuItem value="0">Inactive</MenuItem>
                        </Select>
                    )}
                />

                {/* Display Info (Success/Error) Message */}
                {infoMessage && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 2, // Padding
                            borderRadius: 1, // Rounded corners
                            backgroundColor: infoMessage.type === 'error' ? 'error.light' : 'success.light',
                            color: infoMessage.type === 'error' ? 'error.main' : 'success.main',
                            mb: 2,
                            boxShadow: 2, // Subtle shadow to make the box stand out
                        }}
                    >
                        {/* Icon */}
                        {infoMessage.type === 'error' ? (
                            <Box sx={{ mr: 1 }}>
                                {/* Error icon */}
                                <WarningAmberIcon sx={{ color: 'error.main' }} />
                            </Box>
                        ) : (
                            <Box sx={{ mr: 1 }}>
                                {/* Success icon */}
                                <CheckCircleIcon sx={{ color: 'success.main' }} />
                            </Box>
                        )}
                        {/* Message Text */}
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
