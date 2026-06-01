// NOTE: This is fake/mock data used to prototype the Routes page UI.
// The shapes mirror the backend `IRoute` / `IRouteStop` interfaces so that
// swapping in the real API later requires minimal changes.

export type RouteStopType = 'boarding' | 'dropping' | 'both';

export interface RouteStop {
  id: string;
  stop_name: string;
  city: string;
  landmark?: string;
  stop_type: RouteStopType;
  sequence: number;
  distance_from_source_km: number;
  arrival_offset_minutes: number;
}

export interface RouteOperatorRef {
  _id: string;
  operator_name: string;
}

export interface RouteItem {
  _id: string;
  route_name: string;
  route_code: string;
  source_city: string;
  source_state?: string;
  destination_city: string;
  destination_state?: string;
  distance_km: number;
  estimated_duration_minutes: number;
  base_fare: number;
  stops: RouteStop[];
  operator?: RouteOperatorRef | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const MOCK_OPERATORS: RouteOperatorRef[] = [
  { _id: 'op1', operator_name: 'SRS Travels' },
  { _id: 'op2', operator_name: 'VRL Logistics' },
  { _id: 'op3', operator_name: 'Orange Tours' },
  { _id: 'op4', operator_name: 'Kallada Travels' },
];

export const MOCK_ROUTES: RouteItem[] = [
  {
    _id: 'r1',
    route_name: 'Bangalore → Hyderabad Express',
    route_code: 'BLR-HYD-1A2B',
    source_city: 'Bangalore',
    source_state: 'Karnataka',
    destination_city: 'Hyderabad',
    destination_state: 'Telangana',
    distance_km: 575,
    estimated_duration_minutes: 540,
    base_fare: 899,
    operator: MOCK_OPERATORS[0],
    is_active: true,
    createdAt: '2026-04-02T10:00:00.000Z',
    updatedAt: '2026-05-21T10:00:00.000Z',
    stops: [
      {
        id: 's1',
        stop_name: 'Majestic Bus Stand',
        city: 'Bangalore',
        landmark: 'Near Railway Station',
        stop_type: 'boarding',
        sequence: 1,
        distance_from_source_km: 0,
        arrival_offset_minutes: 0,
      },
      {
        id: 's2',
        stop_name: 'Anantapur Bypass',
        city: 'Anantapur',
        landmark: 'NH44 Toll Plaza',
        stop_type: 'both',
        sequence: 2,
        distance_from_source_km: 210,
        arrival_offset_minutes: 195,
      },
      {
        id: 's3',
        stop_name: 'Kurnool Junction',
        city: 'Kurnool',
        stop_type: 'both',
        sequence: 3,
        distance_from_source_km: 360,
        arrival_offset_minutes: 330,
      },
      {
        id: 's4',
        stop_name: 'MGBS Imlibun',
        city: 'Hyderabad',
        landmark: 'Mahatma Gandhi Bus Station',
        stop_type: 'dropping',
        sequence: 4,
        distance_from_source_km: 575,
        arrival_offset_minutes: 540,
      },
    ],
  },
  {
    _id: 'r2',
    route_name: 'Mumbai → Pune Shuttle',
    route_code: 'BOM-PNQ-7K3L',
    source_city: 'Mumbai',
    source_state: 'Maharashtra',
    destination_city: 'Pune',
    destination_state: 'Maharashtra',
    distance_km: 150,
    estimated_duration_minutes: 210,
    base_fare: 449,
    operator: MOCK_OPERATORS[1],
    is_active: true,
    createdAt: '2026-03-12T10:00:00.000Z',
    updatedAt: '2026-05-18T10:00:00.000Z',
    stops: [
      {
        id: 's5',
        stop_name: 'Dadar TT',
        city: 'Mumbai',
        stop_type: 'boarding',
        sequence: 1,
        distance_from_source_km: 0,
        arrival_offset_minutes: 0,
      },
      {
        id: 's6',
        stop_name: 'Lonavala Food Court',
        city: 'Lonavala',
        landmark: 'Expressway',
        stop_type: 'both',
        sequence: 2,
        distance_from_source_km: 80,
        arrival_offset_minutes: 105,
      },
      {
        id: 's7',
        stop_name: 'Shivajinagar',
        city: 'Pune',
        stop_type: 'dropping',
        sequence: 3,
        distance_from_source_km: 150,
        arrival_offset_minutes: 210,
      },
    ],
  },
  {
    _id: 'r3',
    route_name: 'Chennai → Coimbatore Overnight',
    route_code: 'MAA-CBE-9P4Q',
    source_city: 'Chennai',
    source_state: 'Tamil Nadu',
    destination_city: 'Coimbatore',
    destination_state: 'Tamil Nadu',
    distance_km: 505,
    estimated_duration_minutes: 480,
    base_fare: 799,
    operator: MOCK_OPERATORS[2],
    is_active: false,
    createdAt: '2026-02-20T10:00:00.000Z',
    updatedAt: '2026-04-30T10:00:00.000Z',
    stops: [
      {
        id: 's8',
        stop_name: 'CMBT',
        city: 'Chennai',
        landmark: 'Koyambedu',
        stop_type: 'boarding',
        sequence: 1,
        distance_from_source_km: 0,
        arrival_offset_minutes: 0,
      },
      {
        id: 's9',
        stop_name: 'Salem New Bus Stand',
        city: 'Salem',
        stop_type: 'both',
        sequence: 2,
        distance_from_source_km: 340,
        arrival_offset_minutes: 320,
      },
      {
        id: 's10',
        stop_name: 'Gandhipuram',
        city: 'Coimbatore',
        stop_type: 'dropping',
        sequence: 3,
        distance_from_source_km: 505,
        arrival_offset_minutes: 480,
      },
    ],
  },
  {
    _id: 'r4',
    route_name: 'Delhi → Jaipur Pink City',
    route_code: 'DEL-JAI-2M8N',
    source_city: 'Delhi',
    source_state: 'Delhi',
    destination_city: 'Jaipur',
    destination_state: 'Rajasthan',
    distance_km: 280,
    estimated_duration_minutes: 330,
    base_fare: 599,
    operator: MOCK_OPERATORS[3],
    is_active: true,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-05-01T10:00:00.000Z',
    stops: [
      {
        id: 's11',
        stop_name: 'Kashmere Gate ISBT',
        city: 'Delhi',
        stop_type: 'boarding',
        sequence: 1,
        distance_from_source_km: 0,
        arrival_offset_minutes: 0,
      },
      {
        id: 's12',
        stop_name: 'Behror Midway',
        city: 'Behror',
        landmark: 'NH48',
        stop_type: 'both',
        sequence: 2,
        distance_from_source_km: 150,
        arrival_offset_minutes: 165,
      },
      {
        id: 's13',
        stop_name: 'Sindhi Camp',
        city: 'Jaipur',
        stop_type: 'dropping',
        sequence: 3,
        distance_from_source_km: 280,
        arrival_offset_minutes: 330,
      },
    ],
  },
  {
    _id: 'r5',
    route_name: 'Kochi → Bangalore Coastal',
    route_code: 'COK-BLR-5T1U',
    source_city: 'Kochi',
    source_state: 'Kerala',
    destination_city: 'Bangalore',
    destination_state: 'Karnataka',
    distance_km: 545,
    estimated_duration_minutes: 600,
    base_fare: 999,
    operator: MOCK_OPERATORS[3],
    is_active: true,
    createdAt: '2026-03-28T10:00:00.000Z',
    updatedAt: '2026-05-19T10:00:00.000Z',
    stops: [
      {
        id: 's14',
        stop_name: 'Vyttila Hub',
        city: 'Kochi',
        stop_type: 'boarding',
        sequence: 1,
        distance_from_source_km: 0,
        arrival_offset_minutes: 0,
      },
      {
        id: 's15',
        stop_name: 'Salem Bypass',
        city: 'Salem',
        stop_type: 'both',
        sequence: 2,
        distance_from_source_km: 330,
        arrival_offset_minutes: 360,
      },
      {
        id: 's16',
        stop_name: 'Madiwala',
        city: 'Bangalore',
        stop_type: 'dropping',
        sequence: 3,
        distance_from_source_km: 545,
        arrival_offset_minutes: 600,
      },
    ],
  },
  {
    _id: 'r6',
    route_name: 'Goa → Mumbai Konkan',
    route_code: 'GOI-BOM-8W2X',
    source_city: 'Panaji',
    source_state: 'Goa',
    destination_city: 'Mumbai',
    destination_state: 'Maharashtra',
    distance_km: 590,
    estimated_duration_minutes: 660,
    base_fare: 1099,
    operator: MOCK_OPERATORS[0],
    is_active: false,
    createdAt: '2026-02-05T10:00:00.000Z',
    updatedAt: '2026-04-11T10:00:00.000Z',
    stops: [
      {
        id: 's17',
        stop_name: 'Panaji KTC',
        city: 'Panaji',
        stop_type: 'boarding',
        sequence: 1,
        distance_from_source_km: 0,
        arrival_offset_minutes: 0,
      },
      {
        id: 's18',
        stop_name: 'Ratnagiri',
        city: 'Ratnagiri',
        stop_type: 'both',
        sequence: 2,
        distance_from_source_km: 300,
        arrival_offset_minutes: 360,
      },
      {
        id: 's19',
        stop_name: 'Borivali',
        city: 'Mumbai',
        stop_type: 'dropping',
        sequence: 3,
        distance_from_source_km: 590,
        arrival_offset_minutes: 660,
      },
    ],
  },
];
