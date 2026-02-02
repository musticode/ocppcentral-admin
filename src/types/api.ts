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
