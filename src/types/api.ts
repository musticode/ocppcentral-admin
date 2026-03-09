/**
 * API Response Types
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  user: {
    name: string;
    email: string;
    password: string;
  };
  company: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    website?: string;
    taxId?: string;
    registrationNumber?: string;
  };
}

export interface Transaction {
  transactionId: number;
  chargePointId: string;
  connectorId: number;
  idTag: string;
  meterStart: number;
  reservationId?: number;
  timestamp: string;
  startedAt: string;
  stoppedAt?: string;
  meterStop?: number;
  energyConsumed?: number;
  meterValues?: MeterValue[];
  stopReason?: string;
  status: "Active" | "Completed";
}

export interface MeterValue {
  value: number;
  context:
    | "Sample.Periodic"
    | "Sample.Clock"
    | "Transaction.Begin"
    | "Transaction.End"
    | "Other";
  format: "Raw" | "SignedData";
  measurand:
    | "Energy.Active.Export.Register"
    | "Energy.Active.Import.Register"
    | "Energy.Reactive.Export.Register"
    | "Energy.Reactive.Import.Register"
    | "Energy.Active.Export.Interval"
    | "Energy.Active.Import.Interval"
    | "Energy.Reactive.Export.Interval"
    | "Energy.Reactive.Import.Interval"
    | "Power.Active.Export"
    | "Power.Active.Import"
    | "Power.Offered"
    | "Power.Reactive.Export"
    | "Power.Reactive.Import"
    | "Power.Factor"
    | "Current.Import"
    | "Current.Export"
    | "Current.Offered"
    | "Voltage"
    | "Frequency"
    | "Temperature"
    | "SoC"
    | "RPM";
  location: "Cable" | "EV" | "Inlet" | "Outlet" | "Body";
  unit:
    | "Wh"
    | "kWh"
    | "varh"
    | "kvarh"
    | "W"
    | "kW"
    | "VA"
    | "kVA"
    | "var"
    | "kvar"
    | "A"
    | "V"
    | "K"
    | "Celcius"
    | "Fahrenheit"
    | "Percent";
  phase:
    | "L1"
    | "L2"
    | "L3"
    | "N"
    | "L1-N"
    | "L2-N"
    | "L3-N"
    | "L1-L2"
    | "L2-L3"
    | "L3-L1";
  sampledValue: {
    value: string;
    context:
      | "Sample.Periodic"
      | "Sample.Clock"
      | "Transaction.Begin"
      | "Transaction.End"
      | "Other";
    format: "Raw" | "SignedData";
    measurand:
      | "Energy.Active.Export.Register"
      | "Energy.Active.Import.Register"
      | "Energy.Reactive.Export.Register"
      | "Energy.Reactive.Import.Register"
      | "Energy.Active.Export.Interval"
      | "Energy.Active.Import.Interval"
      | "Energy.Reactive.Export.Interval"
      | "Energy.Reactive.Import.Interval"
      | "Power.Active.Export"
      | "Power.Active.Import"
      | "Power.Offered"
      | "Power.Reactive.Export"
      | "Power.Reactive.Import"
      | "Power.Factor"
      | "Current.Import"
      | "Current.Export"
      | "Current.Offered"
      | "Voltage"
      | "Frequency"
      | "Temperature"
      | "SoC"
      | "RPM";
    location: "Cable" | "EV" | "Inlet" | "Outlet" | "Body";
    unit:
      | "Wh"
      | "kWh"
      | "varh"
      | "kvarh"
      | "W"
      | "kW"
      | "VA"
      | "kVA"
      | "var"
      | "kvar"
      | "A"
      | "V"
      | "K"
      | "Celcius"
      | "Fahrenheit"
      | "Percent";
    phase:
      | "L1"
      | "L2"
      | "L3"
      | "N"
      | "L1-N"
      | "L2-N"
      | "L3-N"
      | "L1-L2"
      | "L2-L3"
      | "L3-L1";
  }[];
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  companyId?: string;
  companyName?: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  website?: string;
  taxId?: string;
  registrationNumber?: string;
  logo?: string;
  description?: string;
  paymentNeeded?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Reservation {
  reservationId: number;
  chargePointId: string;
  connectorId: number;
  idTag: string;
  expiryDate: string;
  status: "Active" | "Used" | "Cancelled" | "Expired";
  transactionId?: number;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancelledBy?: string;
  chargePointName?: string;
  locationName?: string;
}

export interface CreateReservationRequest {
  chargePointId: string;
  connectorId: number;
  idTag: string;
  expiryDate: string;
}

export interface ReservationFilters {
  chargePointId?: string;
  idTag?: string;
  status?: "Active" | "Used" | "Cancelled" | "Expired";
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface ValidateReservationRequest {
  chargePointId: string;
  connectorId: number;
  expiryDate: string;
}

export interface ValidateReservationResponse {
  valid: boolean;
  message?: string;
  conflicts?: Reservation[];
}

export interface Tariff {
  id: string;
  companyId?: string;
  chargePointId?: string;
  connectorId?: number;
  name: string;
  description?: string;
  currency: string;
  pricePerKwh?: number;
  pricePerMinute?: number;
  pricePerSession?: number;
  taxRate?: number;
  validFrom: string;
  validTo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTariffRequest {
  companyId?: string;
  chargePointId?: string;
  connectorId?: number;
  name: string;
  description?: string;
  currency: string;
  pricePerKwh?: number;
  pricePerMinute?: number;
  pricePerSession?: number;
  taxRate?: number;
  validFrom: string;
  validTo?: string;
}

export interface TariffFilters {
  companyId?: string;
  chargePointId?: string;
  connectorId?: number;
  isActive?: boolean;
}

export interface Consumption {
  id: string;
  transactionId: number;
  chargePointId: string;
  connectorId: number;
  idTag: string;
  energyConsumed: number;
  duration: number;
  cost?: number;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface Car {
  id: string;
  userId: string;
  companyId?: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  licensePlate: string;
  vin?: string;
  batteryCapacity?: number;
  range?: number;
  chargingPort?: "Type 1" | "Type 2" | "CCS" | "CHAdeMO" | "Tesla" | "Other";
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCarRequest {
  userId?: string;
  companyId?: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  licensePlate: string;
  vin?: string;
  batteryCapacity?: number;
  range?: number;
  chargingPort?: "Type 1" | "Type 2" | "CCS" | "CHAdeMO" | "Tesla" | "Other";
  notes?: string;
}

export interface UpdateCarRequest {
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  licensePlate?: string;
  vin?: string;
  batteryCapacity?: number;
  range?: number;
  chargingPort?: string;
  notes?: string;
  isActive?: boolean;
}

export interface CarFilters {
  userId?: string;
  companyId?: string;
  isActive?: boolean;
  make?: string;
  model?: string;
  year?: number;
}

export interface CarStats {
  totalCars: number;
  activeCars: number;
  inactiveCars: number;
  byMake: Record<string, number>;
  byChargingPort: Record<string, number>;
}

export interface ChangeAvailabilityRequest {
  connectorId: number;
  type: "Operative" | "Inoperative";
}

export interface ChangeConfigurationRequest {
  key: string;
  value: string;
}

export interface RemoteStartTransactionRequest {
  idTag: string;
  connectorId?: number;
}

export interface RemoteStopTransactionRequest {
  transactionId: number;
}

export interface ResetRequest {
  type: "Hard" | "Soft";
}

export interface UnlockConnectorRequest {
  connectorId: number;
}

export interface GetDiagnosticsRequest {
  location: string;
  startTime?: string;
  stopTime?: string;
  retries?: number;
  retryInterval?: number;
}

export interface UpdateFirmwareRequest {
  retries?: number;
  retryInterval?: number;
}

export interface SendLocalListRequest {
  listVersion: number;
  localAuthorizationList: any[];
  updateType: "Full" | "Differential";
}

export interface ReserveNowRequest {
  connectorId: number;
  expiryDate: string;
  idTag: string;
  reservationId?: number;
  parentIdTag?: string;
}

export interface CancelReservationRequest {
  reservationId: number;
}

export interface TriggerMessageRequest {
  requestedMessage: string;
  connectorId?: number;
}

export interface OCPPResponse {
  status: string;
  message?: string;
  data?: any;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
  companyId?: string;
  companyName?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  companyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLocationRequest {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  description?: string;
}

export interface UpdateLocationRequest {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
}