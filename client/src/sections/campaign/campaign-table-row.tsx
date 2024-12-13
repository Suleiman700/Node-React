import {useState, useCallback} from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, {menuItemClasses} from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

import {Label} from 'src/components/label';
import {Iconify} from 'src/components/iconify';
import {fDateTime} from "../../utils/format-time";

// ----------------------------------------------------------------------

export type CampaignProps = {
    id: string;
    name: string;
    role: string;
    status: string;
    company: string;
    avatarUrl: string;
    isVerified: boolean;
};

type CampaignTableRowProps = {
    row: CampaignProps;
    selected: boolean;
    onRowClickEdit: () => void;
};

export function CampaignTableRow({row, selected, onRowClickEdit, onRowClickDelete}: CampaignTableRowProps) {
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
    const [copied, setCopied] = useState(false);

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const handleRowEdit = useCallback((id: string) => {
        onRowClickEdit(id);
    }, []);

    const handleDeleteRow = useCallback((id: string) => {
        onRowClickDelete(id);
    }, []);

    const handleCopyToken = () => {
        if (row.token) {
            navigator.clipboard.writeText(row.token);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell component="th" scope="row">
                    <Box gap={2} display="flex" alignItems="center">
                        <Avatar alt={row.name} src='assets/icons/marketing.png'/>
                        {row.name}
                    </Box>
                </TableCell>

                <TableCell>
                    <Label color={row.platform.length? 'info':'error'}>{row.platform.length? row.platform:'-'}</Label>
                </TableCell>

                <TableCell>
                    {row.description.length? row.description:'-'}
                </TableCell>

                <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{row.token || '-'}</span>
                    {row.token && (
                        <Tooltip title={copied ? "Copied!" : "Copy token"}>
                            <IconButton 
                                size="small" 
                                onClick={handleCopyToken}
                                sx={{ 
                                    color: copied ? 'success.main' : 'text.secondary',
                                    '&:hover': {
                                        color: copied ? 'success.dark' : 'primary.main'
                                    }
                                }}
                            >
                                {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                    )}
                </TableCell>

                <TableCell>
                    {fDateTime(row.created_at)}
                </TableCell>

                <TableCell>
                    <Label color={row.active=='1'? 'success':'error'}>{row.active=='1'? 'Yes':'No'}</Label>
                </TableCell>

                <TableCell align="right">
                    <IconButton onClick={handleOpenPopover}>
                        <Iconify icon="eva:more-vertical-fill"/>
                    </IconButton>
                </TableCell>
            </TableRow>

            <Popover
                open={!!openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <MenuList
                    disablePadding
                    sx={{
                        p: 0.5,
                        gap: 0.5,
                        width: 140,
                        display: 'flex',
                        flexDirection: 'column',
                        [`& .${menuItemClasses.root}`]: {
                            px: 1,
                            gap: 2,
                            borderRadius: 0.75,
                            [`&.${menuItemClasses.selected}`]: {bgcolor: 'action.selected'},
                        },
                    }}
                >
                    <MenuItem onClick={() => handleRowEdit(row.id)}>
                        <Iconify icon="solar:pen-bold"/>
                        Edit
                    </MenuItem>

                    <MenuItem onClick={() => onRowClickDelete(row.id)} sx={{color: 'error.main'}}>
                        <Iconify icon="solar:trash-bin-trash-bold"/>
                        Delete
                    </MenuItem>
                </MenuList>
            </Popover>
        </>
    );
}
