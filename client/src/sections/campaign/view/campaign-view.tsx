import {useState, useCallback, useEffect} from 'react';
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

import {paths} from 'src/routes/paths';
import {UserService} from 'src/services/UserService';
import {Iconify} from 'src/components/iconify';
import {Scrollbar} from 'src/components/scrollbar';

import {TableNoData} from '../../user/table-no-data';
import {CampaignTableRow} from "../campaign-table-row";
import {CampaignTableHead} from "../campaign-table-head";
import {TableEmptyRows} from '../../user/table-empty-rows';
import {CampaignTableToolbar} from "../campaign-table-toolbar";
import {emptyRows, applyFilter, getComparator} from '../../user/utils';
import {CampaignService} from "../../../services/CampaignService";

// ----------------------------------------------------------------------

export function CampaignView() {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [filterName, setFilterName] = useState('');
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        try {
            const response = await UserService.getCampaigns();
            if (response.status === 200) {
                setCampaigns(response.data || []);  
            }
        } catch (error) {
            console.error('Error loading campaigns:', error);
            setCampaigns([]); 
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

    const handleEditRow = (id: string) => {
        navigate(paths.campaigns.edit(id));
    };

    const handleCreateCampaign = () => {
        navigate(paths.campaigns.new);
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
                const response = await CampaignService.delete(_id);
                
                if (response && response.status === 200) {
                    setCampaigns(prevCampaigns => 
                        prevCampaigns.filter(campaign => campaign.id !== _id)
                    );

                    await Swal.fire({
                        title: 'Deleted!',
                        text: 'Campaign has been deleted.',
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
                    throw new Error('Failed to delete campaign');
                }
            }
        }
        catch (error) {
            console.error('Error deleting campaign:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete campaign. Please try again.',
                icon: 'error',
                customClass: {
                    popup: 'swal2-popup',
                    title: 'swal2-title'
                }
            });
        }
    };

    const dataFiltered = applyFilter({
        inputData: campaigns,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const notFound = !dataFiltered.length && !!filterName;

    return (
        <Container>
            <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">Campaigns</Typography>

                <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={handleCreateCampaign}
                >
                    New Campaign
                </Button>
            </Box>

            <Card>
                <CampaignTableToolbar
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <CampaignTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleSort}
                                headLabel={[
                                    { id: 'name', label: 'Name' },
                                    { id: 'platform', label: 'Platform' },
                                    { id: 'description', label: 'Description' },
                                    { id: 'token', label: 'Token' },
                                    { id: 'created_at', label: 'Created At' },
                                    { id: 'active', label: 'Active' },
                                    { id: '', label: '' },
                                ]}
                            />

                            <TableBody>
                                {dataFiltered
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <CampaignTableRow
                                            key={row.id}
                                            row={row}
                                            selected={false}
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
