export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export type SortDirection = 'asc' | 'desc' | '';

export interface SortColumn {
  field: string;
  direction: SortDirection;
}

export interface SortState {
  columns: SortColumn[];
}

export interface SearchParams {
  searchTerm1: string;
  searchField1: string;
  searchTerm2: string;
  searchField2: string;
}

export interface EmployeeListState {
  searchParams: SearchParams;
  pagination: PaginationState;
  sortState: SortState;
}

export const PAGE_SIZE_OPTIONS: number[] = [10, 25, 50, 100];

export const DEFAULT_PAGINATION: PaginationState = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0
};

export const DEFAULT_SEARCH_PARAMS: SearchParams = {
  searchTerm1: '',
  searchField1: 'firstName',
  searchTerm2: '',
  searchField2: 'status'
};

export const DEFAULT_SORT_STATE: SortState = {
  columns: []
};

export const DEFAULT_EMPLOYEE_LIST_STATE: EmployeeListState = {
  searchParams: DEFAULT_SEARCH_PARAMS,
  pagination: DEFAULT_PAGINATION,
  sortState: DEFAULT_SORT_STATE
};

export const SEARCHABLE_FIELDS: { value: string; label: string }[] = [
  { value: 'firstName', label: 'First Name' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'username', label: 'Username' },
  { value: 'email', label: 'Email' },
  { value: 'status', label: 'Status' },
  { value: 'group', label: 'Group' }
];
