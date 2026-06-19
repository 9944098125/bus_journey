export type OperatorCreator = {
  _id: string;
  full_name?: string;
  email?: string;
  role?: string;
};

export type Operator = {
  _id: string;
  operator_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  logo?: string;
  gst_number?: string;
  address?: string;
  is_active: boolean;
  created_by?: string | OperatorCreator;
  createdAt: string;
  updatedAt: string;
};

export type OperatorListResponse = {
  success: boolean;
  count: number;
  total?: number;
  data: Operator[];
};

export type OperatorSingleResponse = {
  success: boolean;
  message?: string;
  data: Operator;
};

export type OperatorMutationResponse = {
  success: boolean;
  message: string;
  data?: Operator;
};

export type OperatorBusPayload = {
  _id?: string;
  bus_name: string;
  bus_number: string;
  bus_type: string;
  total_seats: string;
  amenities: string | string[];
  photos?: string[];
  source_location?: string;
  driver_photo?: string;
  driving_license?: string;
};

export type OperatorPayload = {
  operator_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  logo?: string;
  gst_number?: string;
  address?: string;
  is_active?: boolean;
  buses?: OperatorBusPayload[];
};

export type UploadOperatorImageResponse = {
  success: boolean;
  message?: string;
  imageUrl?: string;
  data?: {
    imageUrl?: string;
    publicId?: string;
  };
};
