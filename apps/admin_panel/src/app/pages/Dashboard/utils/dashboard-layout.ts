/** KPI: 3 cols × 2 rows (row 1), then 2 equal cols (row 2) — avoids 6-col gap artifacts. */
export const DASHBOARD_KPI_SECTION = 'space-y-5';

export const DASHBOARD_KPI_ROW_GRID =
  'grid w-full grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3';

export const DASHBOARD_KPI_WIDE_ROW_GRID =
  'grid w-full grid-cols-1 items-stretch gap-5 sm:grid-cols-2';

/** Wrap each KPI card so grid cells always stretch full width. */
export const DASHBOARD_KPI_CELL =
  'min-w-0 w-full [&>*]:h-full [&>*]:w-full';

/** Shared grid wrappers so skeleton and loaded dashboard stay aligned. */
export const DASHBOARD_MIDDLE_GRID =
  'grid items-stretch gap-6 lg:grid-cols-2 xl:grid-cols-3';

export const DASHBOARD_MIDDLE_CELL =
  'flex w-full min-w-0 xl:col-span-1';

export const DASHBOARD_BOTTOM_GRID =
  'grid items-stretch gap-6 lg:grid-cols-5';

export const DASHBOARD_BOTTOM_MAIN_CELL = 'flex w-full min-w-0 lg:col-span-3';

export const DASHBOARD_BOTTOM_SIDE_CELL =
  'flex w-full min-w-0 flex-col gap-3 lg:col-span-2';

export const DASHBOARD_INITIAL_SKELETON_MS = 3000;
