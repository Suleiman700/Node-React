import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  filterName: string;
  filterPlatform: string;
  filterCampaign: string;
  filterDate: Date | null;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterPlatform: (value: string) => void;
  onFilterCampaign: (value: string) => void;
  onFilterDate: (date: Date | null) => void;
  onClearFilters: () => void;
  platforms: string[];
  campaigns: string[];
};

export function LeadsTableToolbar({
  filterName,
  filterPlatform,
  filterCampaign,
  filterDate,
  onFilterName,
  onFilterPlatform,
  onFilterCampaign,
  onFilterDate,
  onClearFilters,
  platforms,
  campaigns,
}: Props) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Filters
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder="Search lead..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Platform</InputLabel>
            <Select
              value={filterPlatform}
              onChange={(e) => onFilterPlatform(e.target.value)}
              label="Platform"
            >
              <MenuItem value="">
                <em>All Platforms</em>
              </MenuItem>
              {platforms.map((platform) => (
                <MenuItem key={platform} value={platform}>
                  {platform}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Campaign</InputLabel>
            <Select
              value={filterCampaign}
              onChange={(e) => onFilterCampaign(e.target.value)}
              label="Campaign"
            >
              <MenuItem value="">
                <em>All Campaigns</em>
              </MenuItem>
              {campaigns.map((campaign) => (
                <MenuItem key={campaign} value={campaign}>
                  {campaign}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Filter by Date"
              value={filterDate ? dayjs(filterDate) : null}
              onChange={(newValue) => {
                onFilterDate(newValue ? newValue.toDate() : null);
              }}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'medium'
                }
              }}
            />
          </LocalizationProvider>

          <Tooltip title="Clear all filters">
            <IconButton 
              onClick={onClearFilters}
              sx={{ 
                alignSelf: 'center',
                '&:hover': { color: 'error.main' } 
              }}
            >
              <Iconify icon="ic:round-clear-all" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Stack>
  );
}
