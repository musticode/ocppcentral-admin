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

export interface UpdateUserRequest {
  email?: string;
  role?: string;
  name?: string;
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

export interface Fleet {
  id: string;
  companyId: string;
  managerId?: string;
  name: string;
  description?: string;
  fleetType?: string;
  status: "Active" | "Inactive";
  totalVehicles?: number;
  activeVehicles?: number;
  vehicleCount?: number;
  driverCount?: number;
  totalEnergyConsumed?: number;
  totalSessions?: number;
  averageEfficiency?: number;
  location?: {
    address?: string | { address?: string; lastUpdated?: string };
    city?: string;
    state?: string;
    country?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  settings?: {
    autoAssignment?: boolean;
    maintenanceAlerts?: boolean;
    chargingAlerts?: boolean;
    lowBatteryThreshold?: number;
  };
  metadata?: Record<string, any>;
  // Legacy fields for backward compatibility
  manager?: string;
  managerEmail?: string;
  managerPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFleetRequest {
  name: string;
  description?: string;
  manager?: string;
  managerEmail?: string;
  managerPhone?: string;
  status?: "Active" | "Inactive";
}

export interface UpdateFleetRequest {
  name?: string;
  description?: string;
  manager?: string;
  managerEmail?: string;
  managerPhone?: string;
  status?: "Active" | "Inactive";
}

export interface FleetVehicle {
  id: string;
  fleetId: string;
  carId: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  status: "Available" | "In Use" | "Maintenance" | "Charging";
  currentLocation?: string;
  lastChargeAt?: string;
  batteryLevel?: number;
  odometer?: number;
  totalEnergyConsumed?: number;
  totalSessions?: number;
  assignedAt: string;
  createdAt: string;
  updatedAt: string;
  car?: Car;
}

export interface AssignVehicleToFleetRequest {
  carId: string;
  assignedDriverId?: string;
  status?: "Available" | "In Use" | "Maintenance" | "Charging";
}

export interface UpdateFleetVehicleRequest {
  assignedDriverId?: string;
  status?: "Available" | "In Use" | "Maintenance" | "Charging";
  currentLocation?: string;
  batteryLevel?: number;
  odometer?: number;
}

export interface FleetDriver {
  id: string;
  fleetId: string;
  userId: string;
  userName: string;
  userEmail: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  assignedVehicleId?: string;
  assignedVehicleName?: string;
  status: "Active" | "Inactive" | "On Leave";
  totalSessions?: number;
  totalEnergyConsumed?: number;
  assignedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignDriverToFleetRequest {
  userId: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  status?: "Active" | "Inactive" | "On Leave";
}

export interface UpdateFleetDriverRequest {
  licenseNumber?: string;
  licenseExpiry?: string;
  assignedVehicleId?: string;
  status?: "Active" | "Inactive" | "On Leave";
}

export interface FleetStats {
  totalFleets: number;
  activeFleets: number;
  totalVehicles: number;
  availableVehicles: number;
  vehiclesInUse: number;
  vehiclesCharging: number;
  vehiclesInMaintenance: number;
  totalDrivers: number;
  activeDrivers: number;
  totalEnergyConsumed: number;
  totalSessions: number;
  averageEfficiency: number;
}

export interface FleetAnalytics {
  fleetId: string;
  period: "1W" | "1M" | "3M" | "1Y";
  energyConsumption: Array<{
    date: string;
    energyKwh: number;
    sessions: number;
  }>;
  vehicleUtilization: Array<{
    vehicleId: string;
    vehicleName: string;
    utilizationPercent: number;
    sessions: number;
    energyKwh: number;
  }>;
  driverPerformance: Array<{
    driverId: string;
    driverName: string;
    sessions: number;
    energyKwh: number;
    efficiency: number;
  }>;
  costAnalysis: {
    totalCost: number;
    costPerKwh: number;
    costPerSession: number;
    costPerVehicle: number;
  };
}

export type PaymentMethodStatus =
  | "active"
  | "inactive"
  | "expired"
  | "failed"
  | "pending";

export type PaymentMethodType =
  | "credit_card"
  | "debit_card"
  | "bank_account"
  | "paypal"
  | "stripe"
  | "other";

export type PaymentProvider = "stripe" | "paypal" | "square" | "manual" | "other";

export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "other";

export interface BillingAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  provider: PaymentProvider;
  status: PaymentMethodStatus;
  isActive: boolean;
  isVerified?: boolean;
  isDefault?: boolean;
  cardLast4?: string;
  cardBrand?: CardBrand;
  cardExpMonth?: number;
  cardExpYear?: number;
  bankAccountLast4?: string;
  bankName?: string;
  paypalEmail?: string;
  externalId?: string;
  externalCustomerId?: string;
  billingAddress?: BillingAddress;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentMethodFilters {
  userId?: string;
  isActive?: boolean;
  status?: PaymentMethodStatus;
  type?: PaymentMethodType;
  provider?: string;
}

export interface CreatePaymentMethodRequest {
  userId?: string;
  type: PaymentMethodType;
  provider: PaymentProvider;
  cardLast4?: string;
  cardBrand?: CardBrand;
  cardExpMonth?: number;
  cardExpYear?: number;
  bankAccountLast4?: string;
  bankName?: string;
  paypalEmail?: string;
  externalId?: string;
  externalCustomerId?: string;
  isActive?: boolean;
  isVerified?: boolean;
  isDefault?: boolean;
  billingAddress?: BillingAddress;
  metadata?: Record<string, any>;
}

export interface UpdatePaymentMethodRequest {
  cardExpMonth?: number;
  cardExpYear?: number;
  billingAddress?: BillingAddress;
  isDefault?: boolean;
  metadata?: Record<string, any>;
  status?: PaymentMethodStatus;
}

export interface PaymentMethodStats {
  total: number;
  active: number;
  inactive: number;
  expired: number;
  failed: number;
  pending: number;
  byType: Record<string, number>;
  byProvider: Record<string, number>;
}

export interface PaymentEligibility {
  hasActivePaymentMethod: boolean;
  eligibleToCharge: boolean;
  message?: string;
}

export interface RFIDTag {
  id: string;
  idTag: string;
  companyId?: string;
  userId?: string;
  parentIdTag?: string;
  expiryDate?: string;
  status: "active" | "inactive" | "blocked";
  blocked?: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanySettings {
  id: string;
  companyId: string;
  paymentNeeded?: boolean;
  currency?: string;
  timezone?: string;
  language?: string;
  autoStopEnabled?: boolean;
  maxSessionDuration?: number;
  notificationEmail?: string;
  webhookUrl?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}