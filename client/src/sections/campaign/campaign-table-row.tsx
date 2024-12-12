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

export function CampaignTableRow({row, selected, onRowClickEdit}: CampaignTableRowProps) {
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const handleRowEdit = useCallback((id: string) => {
        console.log(`Editing campaign with ID: ${id}`);
        onRowClickEdit(id);
    }, []);

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
                    {row.description}
                </TableCell>

                <TableCell>
                    {row.token}
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

                    <MenuItem onClick={handleClosePopover} sx={{color: 'error.main'}}>
                        <Iconify icon="solar:trash-bin-trash-bold"/>
                        Delete
                    </MenuItem>
                </MenuList>
            </Popover>
        </>
    );
}
