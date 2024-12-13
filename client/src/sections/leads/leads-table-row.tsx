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
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import {Label} from 'src/components/label';
import {Iconify} from 'src/components/iconify';
import {fDateTime} from "../../utils/format-time";
import Swal from 'sweetalert2';
import {Image, ImageAspectRatioRounded} from "@mui/icons-material";

// ----------------------------------------------------------------------

export type LeadsProps = {
    id: string;
    name: string;
    role: string;
    status: string;
    company: string;
    avatarUrl: string;
    isVerified: boolean;
};

type LeadsTableRowProps = {
    row: LeadsProps;
    index: number; 
    selected: boolean;
    onSelect: () => void;
    onRowClickEdit: () => void;
    onRowClickDelete: () => void;
};

export function LeadsTableRow({row, index, selected, onSelect, onRowClickEdit, onRowClickDelete}: LeadsTableRowProps) {
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
                <TableCell padding="checkbox">
                    <Checkbox 
                        checked={selected} 
                        onChange={onSelect}
                        inputProps={{
                            'aria-label': `select lead ${row.id}`,
                        }}
                    />
                </TableCell>

                <TableCell component="th" scope="row">
                    <Box gap={2} display="flex" alignItems="center">
                        <Avatar alt={row.name} src='assets/icons/navbar/ic-user.png' />
                        {index + 1} 
                    </Box>
                </TableCell>

                <TableCell>
                    {row.campaign_name??'-'}
                </TableCell>

                <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        {row.campaign_platform_favicon_url && (
                            <Avatar
                                src={row.campaign_platform_favicon_url}
                                alt={row.campaign_platform}
                                sx={{ 
                                    width: 20, 
                                    height: 20,
                                    marginRight: 1
                                }}
                            />
                        )}
                        <Label color={row.campaign_platform && row.campaign_platform.length ? 'info' : 'error'}>
                            {row.campaign_platform && row.campaign_platform.length ? row.campaign_platform : '-'}
                        </Label>
                    </Stack>
                </TableCell>

                <TableCell>
                    {!row.data ? (
                        'No data'
                    ) : (
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                                try {
                                    // Parse the data if it's a string, otherwise use it directly
                                    const jsonData = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
                                    // Convert to string with proper formatting
                                    const formattedData = JSON.stringify(jsonData, null, 2)
                                        .replace(/&/g, '&amp;')
                                        .replace(/</g, '&lt;')
                                        .replace(/>/g, '&gt;')
                                        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                                            let cls = 'number';
                                            if (/^"/.test(match)) {
                                                if (/:$/.test(match)) {
                                                    cls = 'key';
                                                } else {
                                                    cls = 'string';
                                                }
                                            } else if (/true|false/.test(match)) {
                                                cls = 'boolean';
                                            } else if (/null/.test(match)) {
                                                cls = 'null';
                                            }
                                            return '<span class="' + cls + '">' + match + '</span>';
                                        });

                                    Swal.fire({
                                        title: 'Lead Data',
                                        html: `
                                            <style>
                                                .json-container pre {
                                                    text-align: left;
                                                    max-height: 70vh;
                                                    overflow-y: auto;
                                                    background-color: #1e1e1e;
                                                    color: #d4d4d4;
                                                    padding: 15px;
                                                    border-radius: 8px;
                                                    white-space: pre-wrap;
                                                    word-wrap: break-word;
                                                    font-family: 'Consolas', 'Monaco', monospace;
                                                }
                                                .json-container .string { color: #ce9178; }
                                                .json-container .number { color: #b5cea8; }
                                                .json-container .boolean { color: #569cd6; }
                                                .json-container .null { color: #569cd6; }
                                                .json-container .key { color: #9cdcfe; }
                                            </style>
                                            <div class="json-container">
                                                <pre>${formattedData}</pre>
                                            </div>
                                        `,
                                        width: '800px',
                                        confirmButtonText: 'Close',
                                        customClass: {
                                            container: 'swal-container',
                                            popup: 'swal-popup',
                                            content: 'swal-content'
                                        }
                                    });
                                } catch (error) {
                                    // If parsing fails, show unformatted data
                                    Swal.fire({
                                        title: 'Lead Data',
                                        html: `
                                            <style>
                                                .json-container pre {
                                                    text-align: left;
                                                    max-height: 70vh;
                                                    overflow-y: auto;
                                                    background-color: #1e1e1e;
                                                    color: #d4d4d4;
                                                    padding: 15px;
                                                    border-radius: 8px;
                                                    white-space: pre-wrap;
                                                    word-wrap: break-word;
                                                    font-family: 'Consolas', 'Monaco', monospace;
                                                }
                                            </style>
                                            <div class="json-container">
                                                <pre>${row.data}</pre>
                                            </div>
                                        `,
                                        width: '800px',
                                        confirmButtonText: 'Close'
                                    });
                                }
                            }}
                        >
                            See Data
                        </Button>
                    )}
                </TableCell>

                <TableCell>
                    {fDateTime(row.created_at)}
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
                    {/*<MenuItem onClick={() => handleRowEdit(row.id)}>*/}
                    {/*    <Iconify icon="solar:pen-bold"/>*/}
                    {/*    Edit*/}
                    {/*</MenuItem>*/}

                    <MenuItem onClick={() => onRowClickDelete(row.id)} sx={{color: 'error.main'}}>
                        <Iconify icon="solar:trash-bin-trash-bold"/>
                        Delete
                    </MenuItem>
                </MenuList>
            </Popover>
        </>
    );
}
