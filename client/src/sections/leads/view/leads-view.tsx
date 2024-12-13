import {useState, useCallback, useEffect, useMemo} from 'react';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';

import {paths} from 'src/routes/paths';
import {UserService} from 'src/services/UserService';
import {Iconify} from 'src/components/iconify';
import {Scrollbar} from 'src/components/scrollbar';

import {TableNoData} from '../../user/table-no-data';
import {LeadsTableRow} from "../leads-table-row";
import {LeadsTableHead} from "../leads-table-head";
import {TableEmptyRows} from '../../user/table-empty-rows';
import {LeadsTableToolbar} from "../leads-table-toolbar";
import {emptyRows, applyFilter, getComparator} from '../utils';
import {CampaignService} from "../../../services/CampaignService";
import {LeadService} from "../../../services/LeadService";

// ----------------------------------------------------------------------

export function LeadsView() {
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [selected, setSelected] = useState<number[]>([]);
    const [filterName, setFilterName] = useState('');
    const [filterPlatform, setFilterPlatform] = useState('');
    const [filterCampaign, setFilterCampaign] = useState('');
    const [filterDate, setFilterDate] = useState<Date | null>(null);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Get unique platforms and campaigns for filters
    const platforms = useMemo(() => 
        Array.from(new Set(leads.map((lead) => lead.campaign_platform)))
        .filter(Boolean)
        .sort(),
    [leads]);

    const campaigns = useMemo(() => 
        Array.from(new Set(leads.map((lead) => lead.campaign_name)))
        .filter(Boolean)
        .sort(),
    [leads]);

    useEffect(() => {
        loadLeads();
    }, []);

    const loadLeads = async () => {
        try {
            const response = await UserService.getLeads();
            if (response.status === 200) {
                setLeads(response.data);
            }
        }
        catch (error) {
            console.error('Error loading leads:', error);
            setLeads([]); 
        }
    };

    const handleSort = useCallback((id: string) => {
        const isAsc = orderBy === id && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(id);
    }, [order, orderBy]);

    const handleChangePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    }, []);

    const handleFilterByName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPage(0);
        setFilterName(event.target.value);
    }, []);

    const handleFilterPlatform = (value: string) => {
        setFilterPlatform(value);
        setPage(0);
    };

    const handleFilterCampaign = (value: string) => {
        setFilterCampaign(value);
        setPage(0);
    };

    const handleEditRow = (id: string) => {
        navigate(paths.leads.edit(id));
    };

    const handleCreateCampaign = () => {
        navigate(paths.leads.new);
    };

    const handleDeleteRow = async (_id: number) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
            });

            if (result.isConfirmed) {
                const response = await LeadService.delete(_id);
                
                if (response && response.status === 200) {
                    setLeads(prevCampaigns => 
                        prevCampaigns.filter(campaign => campaign.id !== _id)
                    );

                    await Swal.fire({
                        title: 'Deleted!',
                        text: 'Lead has been deleted.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                        customClass: {
                            popup: 'swal2-popup',
                            title: 'swal2-title'
                        }
                    });
                }
                else {
                    throw new Error('Failed to delete lead');
                }
            }
        }
        catch (error) {
            console.error('Error deleting lead:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete lead. Please try again.',
                icon: 'error',
                customClass: {
                    popup: 'swal2-popup',
                    title: 'swal2-title'
                }
            });
        }
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = dataFiltered.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const exportToCSV = () => {
        if (selected.length === 0) {
            Swal.fire({
                title: 'No Leads Selected',
                text: 'Please select at least one lead to export',
                icon: 'warning',
                customClass: {
                    popup: 'swal2-popup',
                    title: 'swal2-title'
                }
            });
            return;
        }

        // Filter selected leads
        const selectedLeads = dataFiltered.filter((lead) => selected.includes(lead.id));
        
        // Create CSV content
        const headers = ['ID', 'Campaign', 'Platform', 'Data', 'Created At'];
        const csvContent = [
            headers.join(','),
            ...selectedLeads.map(lead => [
                lead.id,
                lead.campaign_name,
                lead.campaign_platform,
                JSON.stringify(lead.data).replace(/,/g, ';'), // Replace commas in JSON with semicolons
                lead.created_at
            ].join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleClearFilters = () => {
        setFilterName('');
        setFilterPlatform('');
        setFilterCampaign('');
        setFilterDate(null);
        setPage(0);
    };

    const dataFiltered = applyFilter({
        inputData: leads,
        comparator: getComparator(order, orderBy),
        filterName,
        filterPlatform,
        filterCampaign,
        filterDate,
    });

    const notFound = !dataFiltered.length && !!filterName;

    return (
        <Container>
            <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">Leads</Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Tooltip title="Export Selected">
                        <Button
                            variant="outlined"
                            startIcon={<Iconify icon="eva:download-outline" />}
                            onClick={exportToCSV}
                            disabled={selected.length === 0}
                        >
                            Export CSV
                        </Button>
                    </Tooltip>

                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={handleCreateCampaign}
                    >
                        New Lead
                    </Button>
                </Box>
            </Box>

            <Card>
                <LeadsTableToolbar
                    filterName={filterName}
                    filterPlatform={filterPlatform}
                    filterCampaign={filterCampaign}
                    filterDate={filterDate}
                    onFilterName={handleFilterByName}
                    onFilterPlatform={handleFilterPlatform}
                    onFilterCampaign={handleFilterCampaign}
                    onFilterDate={setFilterDate}
                    onClearFilters={handleClearFilters}
                    platforms={platforms}
                    campaigns={campaigns}
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <LeadsTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleSort}
                                numSelected={selected.length}
                                onSelectAllClick={handleSelectAllClick}
                                rowCount={dataFiltered.length}
                                headLabel={[
                                    { id: 'id', label: '#' },
                                    { id: 'campaign', label: 'Campaign' },
                                    { id: 'platform', label: 'Platform' },
                                    { id: 'data', label: 'Data' },
                                    { id: 'created_at', label: 'Created At' },
                                    { id: '', label: '' },
                                ]}
                            />

                            <TableBody>
                                {dataFiltered
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => (
                                        <LeadsTableRow
                                            key={row.id}
                                            row={row}
                                            index={index}
                                            selected={selected.includes(row.id)}
                                            onSelect={() => handleClick(row.id)}
                                            onRowClickEdit={() => handleEditRow(row.id)}
                                            onRowClickDelete={() => handleDeleteRow(row.id)}
                                        />
                                    ))}

                                <TableEmptyRows
                                    height={77}
                                    emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
                                />

                                {notFound && <TableNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    page={page}
                    component="div"
                    count={dataFiltered.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </Container>
    );
}
