/**
 * OCPP 1.6 Types and Enums
 * Based on Open Charge Point Protocol 1.6 specification
 */

export enum ConnectorStatus {
  AVAILABLE = "Available",
  PREPARING = "Preparing",
  CHARGING = "Charging",
  SUSPENDED_EVSE = "SuspendedEVSE",
  SUSPENDED_EV = "SuspendedEV",
  FINISHING = "Finishing",
  RESERVED = "Reserved",
  UNAVAILABLE = "Unavailable",
  FAULTED = "Faulted",
}

export enum ChargePointStatus {
  AVAILABLE = "Available",
  PREPARING = "Preparing",
  CHARGING = "Charging",
  SUSPENDED_EVSE = "SuspendedEVSE",
  SUSPENDED_EV = "SuspendedEV",
  FINISHING = "Finishing",
  RESERVED = "Reserved",
  UNAVAILABLE = "Unavailable",
  FAULTED = "Faulted",
}

export enum RemoteStartStopStatus {
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
}

export enum ResetStatus {
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
}

export enum ResetType {
  HARD = "Hard",
  SOFT = "Soft",
}

export enum AvailabilityStatus {
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
  SCHEDULED = "Scheduled",
}

export enum AvailabilityType {
  INOPERATIVE = "Inoperative",
  OPERATIVE = "Operative",
}

export enum TransactionStatus {
  ACTIVE = "Active",
  COMPLETED = "Completed",
}

export interface ChargePoint {
  id: string;
  chargePointId: string;
  name: string;
  locationId: string;
  locationName: string;
  model?: string;
  vendor?: string;
  firmwareVersion?: string;
  status: ChargePointStatus;
  connectors: Connector[];
  lastHeartbeat?: string;
  ocppVersion: string;
  createdAt: string;
  updatedAt: string;
}

export interface Connector {
  id: string;
  connectorId: number;
  chargePointId: string;
  status: ConnectorStatus;
  type?: string;
  powerKw?: number;
  lastMeterValue?: MeterValue;
  transactionId?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  chargePoints: ChargePoint[];
  totalStations: number;
  totalConnectors: number;
}

export interface Transaction {
  id: string;
  transactionId: number;
  chargePointId: string;
  connectorId: number;
  idTag: string;
  startTimestamp: string;
  stopTimestamp?: string;
  meterStart: number;
  meterStop?: number;
  status: TransactionStatus;
  userId?: string;
  userName?: string;
}

export interface MeterValue {
  timestamp: string;
  sampledValue: {
    value: string;
    context?: string;
    format?: string;
    measurand?: string;
    location?: string;
    unit?: string;
  }[];
}

export interface RemoteCommand {
  id: string;
  chargePointId: string;
  command:
    | "RemoteStartTransaction"
    | "RemoteStopTransaction"
    | "Reset"
    | "ChangeAvailability"
    | "UnlockConnector";
  status: "Pending" | "Accepted" | "Rejected" | "Timeout";
  payload: Record<string, unknown>;
  createdAt: string;
  result?: Record<string, unknown>;
}

export interface Session {
  id: string;
  transactionId: number;
  chargePointId: string;
  chargePointName: string;
  connectorId: number;
  idTag: string;
  startTime: string;
  endTime?: string;
  energyKwh: number;
  duration?: number;
  status: TransactionStatus;
}

export interface Event {
  id: string;
  chargePointId: string;
  connectorId?: number;
  type:
    | "StatusNotification"
    | "MeterValues"
    | "StartTransaction"
    | "StopTransaction"
    | "Heartbeat"
    | "Error";
  message: string;
  timestamp: string;
  severity?: "info" | "warning" | "error";
}
