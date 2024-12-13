import type { UserProps } from './user-table-row';

// ----------------------------------------------------------------------

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
} as const;

// ----------------------------------------------------------------------

function descendingComparator(a: any, b: any, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// ----------------------------------------------------------------------

export function getComparator(order: 'asc' | 'desc', orderBy: string) {
  return order === 'desc'
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: any[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterPlatform: string;
  filterCampaign: string;
  filterDate: Date | null;
};

export function applyFilter({ 
  inputData, 
  comparator, 
  filterName, 
  filterPlatform, 
  filterCampaign,
  filterDate,
}: ApplyFilterProps) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (lead) =>
        lead.campaign_name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        lead.campaign_platform.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        JSON.stringify(lead.data).toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterPlatform) {
    inputData = inputData.filter((lead) => lead.campaign_platform === filterPlatform);
  }

  if (filterCampaign) {
    inputData = inputData.filter((lead) => lead.campaign_name === filterCampaign);
  }

  if (filterDate) {
    const selectedDate = new Date(filterDate);
    selectedDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    inputData = inputData.filter((lead) => {
      const leadDate = new Date(lead.created_at);
      return leadDate >= selectedDate && leadDate < nextDay;
    });
  }

  return inputData;
}

// ----------------------------------------------------------------------

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}
