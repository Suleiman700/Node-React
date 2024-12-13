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
import IconButton from '@mui/material/IconButton';
import { Iconify } from 'src/components/iconify';

import { CampaignService } from "../../services/CampaignService";
import RHFTextField from "src/components/hook-form/RHFTextField";
import FormProvider from 'src/components/hook-form/form-provider';
import Select from "@mui/material/Select";
import {UserCampaignPlatformsService} from "../../services/UserCampaignPlatformsService";

// import 'src/assets/styles/sweetalert.css';

// ----------------------------------------------------------------------

const Schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    active: Yup.string().required('Active state is required'),
    platform: Yup.string().when(['id', 'isAddingNewPlatform'], {
        is: (platform_id: string, isAddingNewPlatform: boolean) => !platform_id && isAddingNewPlatform,
        then: () => Yup.string().required('Platform is required'),
        otherwise: () => Yup.string()
    }),
    platform_id: Yup.string().when(['platform', 'isAddingNewPlatform'], {
        is: (platform: string, isAddingNewPlatform: boolean) => !platform && !isAddingNewPlatform,
        then: () => Yup.string().required('Platform is required'),
        otherwise: () => Yup.string()
    }),
});

// ----------------------------------------------------------------------

type Props = {
    campaign?: any;
    platforms?: any;
    onSubmit: (data: any) => void;
    loading?: boolean;
    onPlatformDelete: (platformId: string) => Promise<void>;
};

export function CampaignForm({ campaign, onSubmit, platforms: initialPlatforms, loading, onPlatformDelete }: Props) {
    const [infoMessage, setInfoMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isAddingNewPlatform, setIsAddingNewPlatform] = useState(false);
    const [platforms, setPlatforms] = useState(initialPlatforms);

    useEffect(() => {
        setPlatforms(initialPlatforms);
    }, [initialPlatforms]);

    const methods = useForm({
        resolver: yupResolver(Schema),
        defaultValues: {
            name: '',
            active: '1',
            platform: '',
            platform: '',
            isAddingNewPlatform: false
        },
        context: { isAddingNewPlatform }
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
            setInfoMessage({
                type: 'error',
                message: 'Unexpected error occurred. Please try again later.',
            });
        }
    });

    const handlePlatformDelete = async (platformId: number, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent select from opening
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this platform",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                const response = await UserCampaignPlatformsService.delete(platformId);

                if (response && response.status === 200) {
                    setPlatforms(prevPlatforms => prevPlatforms.filter(platform => platform.id !== platformId));
                    
                    await Swal.fire({
                        title: 'Deleted!',
                        text: 'Platform has been deleted.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                        customClass: {
                            popup: 'swal2-popup',
                            title: 'swal2-title'
                        }
                    });
                } else {
                    throw new Error('Failed to delete platform');
                }
            } catch (error) {
                await Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete platform.',
                    icon: 'error',
                    timer: 1500,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'swal2-popup',
                        title: 'swal2-title'
                    }
                });
            }
        }
    };

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
            <Stack spacing={3} sx={{ p: 3 }}>
                <RHFTextField name="name" label="Campaign Name" />

                <Box>
                    {platforms && platforms.length > 0 && (
                        <Button
                            variant="text"
                            onClick={() => setIsAddingNewPlatform(!isAddingNewPlatform)}
                            sx={{ mb: 2 }}
                        >
                            {isAddingNewPlatform ? '← Select Existing Platform' : '+ Add New Platform'}
                        </Button>
                    )}

                    {(platforms && platforms.length > 0 && !isAddingNewPlatform) ? (
                        <Controller
                            name="platform"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <Box>
                                    <Select
                                        {...field}
                                        fullWidth
                                        displayEmpty
                                        error={!!error}
                                    >
                                        <MenuItem value="" disabled>
                                            <em>Select Platform</em>
                                        </MenuItem>
                                        {platforms.map((platform: any) => (
                                            <MenuItem 
                                                key={platform.id} 
                                                value={platform.name}
                                                sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {platform.name}
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => handlePlatformDelete(platform.id, e)}
                                                    sx={{
                                                        ml: 2,
                                                        '&:hover': {
                                                            color: 'error.main'
                                                        }
                                                    }}
                                                >
                                                    <Iconify icon="eva:trash-2-outline" />
                                                </IconButton>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {error && (
                                        <FormHelperText error>
                                            {error.message}
                                        </FormHelperText>
                                    )}
                                </Box>
                            )}
                        />
                    ) : (
                        <Box>
                            <RHFTextField 
                                name="platform" 
                                label="Campaign Platform" 
                            />
                            <FormHelperText sx={{ px: 2, color: 'gray' }}>
                                Enter platform name (e.g., Facebook, TikTok, Instagram)
                            </FormHelperText>
                        </Box>
                    )}
                </Box>

                <RHFTextField 
                    name="token" 
                    label="Campaign Token" 
                    disabled={true} 
                    value={campaign ? campaign.token : 'Will be generated upon creating campaign'} 
                />
                <RHFTextField name="description" label="Description" multiline rows={4} />
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
