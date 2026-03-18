import type {
  Location as ApiLocation,
  AssignDriverToFleetRequest,
  AssignVehicleToFleetRequest,
  Car,
  CarStats,
  Company,
  Consumption,
  CreateCarRequest,
  CreateFleetRequest,
  CreateLocationRequest,
  CreateReservationRequest,
  CreateTariffRequest,
  CreateUserRequest,
  Fleet,
  FleetAnalytics,
  FleetDriver,
  FleetStats,
  FleetVehicle,
  LoginRequest,
  LoginResponse,
  OCPPResponse,
  PaginatedResponse,
  PaymentEligibility,
  PaymentMethod,
  PaymentMethodStats,
  Reservation,
  ReservationFilters,
  SignupRequest,
  Tariff,
  TariffFilters,
  UpdateCarRequest,
  UpdateFleetDriverRequest,
  UpdateFleetRequest,
  UpdateFleetVehicleRequest,
  UpdateLocationRequest,
  User,
  ValidateReservationRequest,
  ValidateReservationResponse,
} from "@/types/api";
import type {
  ChargePoint,
  ChargePointStatus,
  Connector,
  ConnectorStatus,
  Event,
  Location as OcppLocation,
  RemoteCommand,
  ResetType,
  Session,
  Transaction,
  TransactionStatus,
} from "@/types/ocpp";

function nowIso() {
  return new Date().toISOString();
}

function paginate<T>(items: T[], page = 1, limit = 20): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);
  return { data, total, page, limit, totalPages };
}

const demoCompany: Company = {
  id: "demo-company-1",
  name: "Demo Fleet Co",
  email: "admin@demo-fleet.co",
  phone: "+1 555 0100",
  address: "101 Demo Street, Demo City",
  city: "Demo City",
  state: "CA",
  zipCode: "94105",
  country: "US",
  createdAt: nowIso(),
  updatedAt: nowIso(),
};

const demoUsers: User[] = [
  {
    id: "user-1",
    name: "Alex Morgan",
    email: "alex@demo-fleet.co",
    role: "Admin",
    companyId: demoCompany.id,
  },
  {
    id: "user-2",
    name: "Sam Lee",
    email: "sam@demo-fleet.co",
    role: "Operator",
    companyId: demoCompany.id,
  },
];

const demoApiLocations: ApiLocation[] = [
  {
    id: "loc-1",
    name: "Downtown Station",
    address: "12 Market St",
    description: "High utilization, mixed AC/DC",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "loc-2",
    name: "Airport Hub",
    address: "1 Terminal Ave",
    description: "Fast DC chargers near arrivals",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "loc-3",
    name: "Shopping Mall",
    address: "200 Retail Rd",
    description: "Public parking, AC chargers",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

function makeConnector(chargePointId: string, connectorId: number, status: ConnectorStatus): Connector {
  const isDC = connectorId % 2 === 0;
  return {
    id: `${chargePointId}-conn-${connectorId}`,
    connectorId,
    chargePointId,
    status,
    type: isDC ? "CCS" : "Type 2",
    powerKw: isDC ? 60 : 22,
    tariffId: isDC ? "tariff-2" : "tariff-1",
    tariffName: isDC ? "Fast DC" : "Standard AC",
  };
}

const demoChargePoints: ChargePoint[] = [
  {
    id: "cp-1",
    chargePointId: "CP-DEMO-0001",
    name: "Downtown CP-01",
    locationId: "loc-1",
    locationName: "Downtown Station",
    model: "ACME X2",
    vendor: "ACME",
    firmwareVersion: "1.2.3",
    status: "Available" as ChargePointStatus,
    connectors: [
      makeConnector("cp-1", 1, "Available" as ConnectorStatus),
      makeConnector("cp-1", 2, "Charging" as ConnectorStatus),
    ],
    lastHeartbeat: nowIso(),
    ocppVersion: "1.6",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "cp-2",
    chargePointId: "CP-DEMO-0002",
    name: "Airport DC-01",
    locationId: "loc-2",
    locationName: "Airport Hub",
    model: "VoltFast 120",
    vendor: "VoltFast",
    firmwareVersion: "3.0.0",
    status: "Preparing" as ChargePointStatus,
    connectors: [
      makeConnector("cp-2", 1, "Preparing" as ConnectorStatus),
      makeConnector("cp-2", 2, "Unavailable" as ConnectorStatus),
    ],
    lastHeartbeat: nowIso(),
    ocppVersion: "1.6",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "cp-3",
    chargePointId: "CP-DEMO-0003",
    name: "Mall CP-01",
    locationId: "loc-3",
    locationName: "Shopping Mall",
    model: "ACME X1",
    vendor: "ACME",
    firmwareVersion: "1.2.0",
    status: "Unavailable" as ChargePointStatus,
    connectors: [makeConnector("cp-3", 1, "Unavailable" as ConnectorStatus)],
    lastHeartbeat: nowIso(),
    ocppVersion: "1.6",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

const demoOcppLocations: OcppLocation[] = demoApiLocations.map((l) => {
  const cps = demoChargePoints.filter((cp) => cp.locationId === l.id);
  const totalConnectors = cps.reduce((acc, cp) => acc + (cp.connectors?.length ?? 0), 0);

  return {
    id: l.id,
    name: l.name,
    address: l.address,
    city: "Demo City",
    country: "US",
    zipCode: "94105",
    latitude: 37.789,
    longitude: -122.401,
    chargePoints: cps,
    totalStations: cps.length,
    totalConnectors,
  };
});

const demoCars: Car[] = [
  {
    id: "car-1",
    userId: "user-1",
    companyId: demoCompany.id,
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    color: "White",
    licensePlate: "DEMO-301",
    vin: "5YJ3E1EA7PF000001",
    batteryCapacity: 60,
    range: 430,
    chargingPort: "Tesla",
    notes: "Assigned to Alex",
    isActive: true,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "car-2",
    userId: "user-2",
    companyId: demoCompany.id,
    make: "Nissan",
    model: "Leaf",
    year: 2020,
    color: "Blue",
    licensePlate: "DEMO-LEAF",
    vin: "1N4AZ1CP0LC000002",
    batteryCapacity: 40,
    range: 240,
    chargingPort: "CHAdeMO",
    notes: "Pool vehicle",
    isActive: true,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "car-3",
    userId: "user-1",
    companyId: demoCompany.id,
    make: "Volkswagen",
    model: "ID.4",
    year: 2022,
    color: "Gray",
    licensePlate: "DEMO-ID4",
    batteryCapacity: 77,
    range: 520,
    chargingPort: "CCS",
    notes: "Inactive demo",
    isActive: false,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

const demoSessions: Session[] = [
  // Active sessions
  {
    id: "sess-1",
    transactionId: 5001,
    chargePointId: "CP-DEMO-0001",
    connectorId: 2,
    idTag: "RFID-1001",
    startTimestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    meterStart: 12000,
    status: "Active" as TransactionStatus,
    userId: "user-1",
    userName: "Alex Morgan",
    totalCost: 8.50,
  },
  {
    id: "sess-2",
    transactionId: 5002,
    chargePointId: "CP-DEMO-0002",
    connectorId: 1,
    idTag: "RFID-1002",
    startTimestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    meterStart: 2100,
    status: "Active" as TransactionStatus,
    userId: "user-2",
    userName: "Sam Lee",
    totalCost: 5.25,
  },
  {
    id: "sess-3",
    transactionId: 5003,
    chargePointId: "CP-DEMO-0004",
    connectorId: 1,
    idTag: "RFID-1005",
    startTimestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    meterStart: 8500,
    status: "Active" as TransactionStatus,
    userId: "user-5",
    userName: "Emma Wilson",
    totalCost: 3.75,
  },

  // Completed sessions - Today
  {
    id: "sess-4",
    transactionId: 5004,
    chargePointId: "CP-DEMO-0001",
    connectorId: 1,
    idTag: "RFID-1003",
    startTimestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    stopTimestamp: new Date(Date.now() - 1000 * 60 * 135).toISOString(),
    meterStart: 15000,
    meterStop: 16200,
    status: "Completed" as TransactionStatus,
    stopReason: "Local",
    userId: "user-3",
    userName: "Jordan Smith",
    totalCost: 12.50,
    energyCost: 10.00,
    timeCost: 2.00,
    sessionFee: 0.50,
  },
  {
    id: "sess-5",
    transactionId: 5005,
    chargePointId: "CP-DEMO-0003",
    connectorId: 2,
    idTag: "RFID-1004",
    startTimestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    stopTimestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    meterStart: 22000,
    meterStop: 23500,
    status: "Completed" as TransactionStatus,
    stopReason: "EVDisconnected",
    userId: "user-4",
    userName: "Taylor Brown",
    totalCost: 15.75,
    energyCost: 13.50,
    timeCost: 2.00,
    sessionFee: 0.25,
  },
  {
    id: "sess-6",
    transactionId: 5006,
    chargePointId: "CP-DEMO-0002",
    connectorId: 2,
    idTag: "RFID-1001",
    startTimestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    stopTimestamp: new Date(Date.now() - 1000 * 60 * 250).toISOString(),
    meterStart: 5000,
    meterStop: 5800,
    status: "Completed" as TransactionStatus,
    stopReason: "Local",
    userId: "user-1",
    userName: "Alex Morgan",
    totalCost: 8.20,
    energyCost: 7.00,
    timeCost: 1.00,
    sessionFee: 0.20,
  },
  {
    id: "sess-7",
    transactionId: 5007,
    chargePointId: "CP-DEMO-0004",
    connectorId: 2,
    idTag: "RFID-1006",
    startTimestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    stopTimestamp: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    meterStart: 18000,
    meterStop: 18650,
    status: "Completed" as TransactionStatus,
    stopReason: "Remote",
    userId: "user-6",
    userName: "Chris Davis",
    totalCost: 6.50,
    energyCost: 5.50,
    timeCost: 0.80,
    sessionFee: 0.20,
  },

  // Yesterday's sessions
  {
    id: "sess-8",
    transactionId: 5008,
    chargePointId: "CP-DEMO-0001",
    connectorId: 1,
    idTag: "RFID-1002",
    startTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    stopTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    meterStart: 10000,
    meterStop: 11400,
    status: "Completed" as TransactionStatus,
    stopReason: "Local",
    userId: "user-2",
    userName: "Sam Lee",
    totalCost: 14.00,
    energyCost: 12.00,
    timeCost: 1.75,
    sessionFee: 0.25,
  },
  {
    id: "sess-9",
    transactionId: 5009,
    chargePointId: "CP-DEMO-0003",
    connectorId: 1,
    idTag: "RFID-1005",
    startTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    stopTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 29).toISOString(),
    meterStart: 7500,
    meterStop: 8900,
    status: "Completed" as TransactionStatus,
    stopReason: "EVDisconnected",
    userId: "user-5",
    userName: "Emma Wilson",
    totalCost: 13.50,
    energyCost: 11.50,
    timeCost: 1.75,
    sessionFee: 0.25,
  },
  {
    id: "sess-10",
    transactionId: 5010,
    chargePointId: "CP-DEMO-0002",
    connectorId: 1,
    idTag: "RFID-1003",
    startTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 32).toISOString(),
    stopTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 31.5).toISOString(),
    meterStart: 3000,
    meterStop: 3450,
    status: "Completed" as TransactionStatus,
    stopReason: "Local",
    userId: "user-3",
    userName: "Jordan Smith",
    totalCost: 4.75,
    energyCost: 4.00,
    timeCost: 0.60,
    sessionFee: 0.15,
  },

  // Older sessions (last 7 days)
  {
    id: "sess-11",
    transactionId: 5011,
    chargePointId: "CP-DEMO-0004",
    connectorId: 1,
    idTag: "RFID-1004",
    startTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    stopTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 49).toISOString(),
    meterStart: 20000,
    meterStop: 21800,
    status: "Completed" as TransactionStatus,
    stopReason: "Local",
    userId: "user-4",
    userName: "Taylor Brown",
    totalCost: 18.00,
    energyCost: 16.00,
    timeCost: 1.75,
    sessionFee: 0.25,
  },
  {
    id: "sess-12",
    transactionId: 5012,
    chargePointId: "CP-DEMO-0001",
    connectorId: 2,
    idTag: "RFID-1006",
    startTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    stopTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 71).toISOString(),
    meterStart: 13000,
    meterStop: 14100,
    status: "Completed" as TransactionStatus,
    stopReason: "Remote",
    userId: "user-6",
    userName: "Chris Davis",
    totalCost: 11.00,
    energyCost: 9.50,
    timeCost: 1.25,
    sessionFee: 0.25,
  },
  {
    id: "sess-13",
    transactionId: 5013,
    chargePointId: "CP-DEMO-0003",
    connectorId: 2,
    idTag: "RFID-1001",
    startTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    stopTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 95).toISOString(),
    meterStart: 25000,
    meterStop: 26500,
    status: "Completed" as TransactionStatus,
    stopReason: "Local",
    userId: "user-1",
    userName: "Alex Morgan",
    totalCost: 15.00,
    energyCost: 13.00,
    timeCost: 1.75,
    sessionFee: 0.25,
  },
  {
    id: "sess-14",
    transactionId: 5014,
    chargePointId: "CP-DEMO-0002",
    connectorId: 2,
    idTag: "RFID-1002",
    startTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    stopTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 119).toISOString(),
    meterStart: 6000,
    meterStop: 7200,
    status: "Completed" as TransactionStatus,
    stopReason: "EVDisconnected",
    userId: "user-2",
    userName: "Sam Lee",
    totalCost: 12.00,
    energyCost: 10.50,
    timeCost: 1.25,
    sessionFee: 0.25,
  },
  {
    id: "sess-15",
    transactionId: 5015,
    chargePointId: "CP-DEMO-0004",
    connectorId: 2,
    idTag: "RFID-1005",
    startTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
    stopTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 143).toISOString(),
    meterStart: 9000,
    meterStop: 10300,
    status: "Completed" as TransactionStatus,
    stopReason: "Local",
    userId: "user-5",
    userName: "Emma Wilson",
    totalCost: 13.00,
    energyCost: 11.25,
    timeCost: 1.50,
    sessionFee: 0.25,
  },

  // Failed session
  {
    id: "sess-16",
    transactionId: 5016,
    chargePointId: "CP-DEMO-0003",
    connectorId: 1,
    idTag: "RFID-1003",
    startTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
    stopTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 168 + 1000 * 60 * 5).toISOString(),
    meterStart: 16000,
    meterStop: 16050,
    status: "Failed" as TransactionStatus,
    stopReason: "PowerLoss",
    userId: "user-3",
    userName: "Jordan Smith",
    totalCost: 0.50,
  },
];

const demoEvents: Event[] = [
  {
    id: "evt-1",
    chargePointId: "CP-DEMO-0001",
    connectorId: 2,
    type: "StartTransaction",
    message: "Transaction started",
    timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    severity: "info",
  },
  {
    id: "evt-2",
    chargePointId: "CP-DEMO-0002",
    connectorId: 1,
    type: "StatusNotification",
    message: "Connector Preparing",
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    severity: "warning",
  },
  {
    id: "evt-3",
    chargePointId: "CP-DEMO-0003",
    type: "Error",
    message: "Charger unavailable (maintenance)",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    severity: "error",
  },
  {
    id: "evt-4",
    chargePointId: "CP-DEMO-0001",
    connectorId: 1,
    type: "MeterValues",
    message: "MeterValues received: 6.2 kW, 231V",
    timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    severity: "info",
  },
  {
    id: "evt-5",
    chargePointId: "CP-DEMO-0004",
    connectorId: 2,
    type: "Heartbeat",
    message: "Heartbeat received",
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    severity: "info",
  },
  {
    id: "evt-6",
    chargePointId: "CP-DEMO-0002",
    connectorId: 2,
    type: "StartTransaction",
    message: "Transaction started for idTag RFID-1001",
    timestamp: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
    severity: "info",
  },
  {
    id: "evt-7",
    chargePointId: "CP-DEMO-0003",
    connectorId: 1,
    type: "StatusNotification",
    message: "Connector Faulted",
    timestamp: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
    severity: "error",
  },
  {
    id: "evt-8",
    chargePointId: "CP-DEMO-0004",
    connectorId: 1,
    type: "MeterValues",
    message: "MeterValues received: 11.0 kW, 398V",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    severity: "info",
  },
  {
    id: "evt-9",
    chargePointId: "CP-DEMO-0001",
    connectorId: 2,
    type: "StopTransaction",
    message: "Transaction stopped: EVDisconnected",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    severity: "info",
  },
  {
    id: "evt-10",
    chargePointId: "CP-DEMO-0002",
    connectorId: 1,
    type: "Error",
    message: "OverCurrentFailure detected on connector 1",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    severity: "warning",
  },
  {
    id: "evt-11",
    chargePointId: "CP-DEMO-0003",
    connectorId: 2,
    type: "Heartbeat",
    message: "Heartbeat received",
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    severity: "info",
  },
  {
    id: "evt-12",
    chargePointId: "CP-DEMO-0004",
    connectorId: 2,
    type: "StatusNotification",
    message: "Connector Charging",
    timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
    severity: "info",
  },
  {
    id: "evt-13",
    chargePointId: "CP-DEMO-0001",
    connectorId: 1,
    type: "StatusNotification",
    message: "Connector Available",
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    severity: "info",
  },
  {
    id: "evt-14",
    chargePointId: "CP-DEMO-0002",
    connectorId: 2,
    type: "StopTransaction",
    message: "Transaction stopped: Remote",
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    severity: "info",
  },
  {
    id: "evt-15",
    chargePointId: "CP-DEMO-0003",
    connectorId: 1,
    type: "Error",
    message: "PowerLoss - session interrupted",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    severity: "error",
  },
  {
    id: "evt-16",
    chargePointId: "CP-DEMO-0004",
    connectorId: 1,
    type: "MeterValues",
    message: "MeterValues received: 7.4 kW, 230V",
    timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    severity: "info",
  },
];

const demoRemoteCommands: RemoteCommand[] = [
  {
    id: "cmd-1",
    chargePointId: "CP-DEMO-0001",
    command: "RemoteStartTransaction",
    status: "Accepted",
    payload: { connectorId: 1, idTag: "RFID-1001" },
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    result: { status: "Accepted" },
  },
  {
    id: "cmd-2",
    chargePointId: "CP-DEMO-0002",
    command: "RemoteStopTransaction",
    status: "Accepted",
    payload: { transactionId: 5002 },
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    result: { status: "Accepted" },
  },
  {
    id: "cmd-3",
    chargePointId: "CP-DEMO-0003",
    command: "Reset",
    status: "Accepted",
    payload: { type: "Soft" },
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    result: { status: "Accepted" },
  },
  {
    id: "cmd-4",
    chargePointId: "CP-DEMO-0001",
    command: "ChangeAvailability",
    status: "Accepted",
    payload: { connectorId: 2, type: "Operative" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    result: { status: "Accepted" },
  },
  {
    id: "cmd-5",
    chargePointId: "CP-DEMO-0004",
    command: "UnlockConnector",
    status: "Accepted",
    payload: { connectorId: 1 },
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    result: { status: "Accepted" },
  },
  {
    id: "cmd-6",
    chargePointId: "CP-DEMO-0002",
    command: "RemoteStartTransaction",
    status: "Rejected",
    payload: { connectorId: 1, idTag: "RFID-INVALID" },
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    result: { status: "Rejected", reason: "Invalid RFID tag" },
  },
  {
    id: "cmd-7",
    chargePointId: "CP-DEMO-0003",
    command: "ChangeAvailability",
    status: "Accepted",
    payload: { connectorId: 1, type: "Inoperative" },
    createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    result: { status: "Accepted" },
  },
  {
    id: "cmd-8",
    chargePointId: "CP-DEMO-0001",
    command: "Reset",
    status: "Pending",
    payload: { type: "Hard" },
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "cmd-9",
    chargePointId: "CP-DEMO-0004",
    command: "RemoteStopTransaction",
    status: "Timeout",
    payload: { transactionId: 5003 },
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "cmd-10",
    chargePointId: "CP-DEMO-0002",
    command: "UnlockConnector",
    status: "Rejected",
    payload: { connectorId: 2 },
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    result: { status: "Rejected", reason: "Connector in use" },
  },
  {
    id: "cmd-11",
    chargePointId: "CP-DEMO-0001",
    command: "RemoteStartTransaction",
    status: "Accepted",
    payload: { connectorId: 2, idTag: "RFID-1002" },
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    result: { status: "Accepted" },
  },
  {
    id: "cmd-12",
    chargePointId: "CP-DEMO-0003",
    command: "Reset",
    status: "Accepted",
    payload: { type: "Hard" },
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    result: { status: "Accepted" },
  },
];

const demoReservations: Reservation[] = [
  {
    reservationId: 9001,
    chargePointId: "CP-DEMO-0001",
    connectorId: 1,
    idTag: "RFID-1001",
    status: "Active",
    expiryDate: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: nowIso(),
    chargePointName: "Downtown CP-01",
    locationName: "Downtown Station",
    transactionId: undefined,
  },
  {
    reservationId: 9002,
    chargePointId: "CP-DEMO-0002",
    connectorId: 1,
    idTag: "RFID-1002",
    status: "Used",
    expiryDate: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    updatedAt: nowIso(),
    chargePointName: "Airport DC-01",
    locationName: "Airport Hub",
    transactionId: 5002,
  },
];

const demoTariffs: Tariff[] = [
  {
    id: "tariff-1",
    name: "Standard AC",
    description: "AC charging",
    companyId: demoCompany.id,
    isActive: true,
    currency: "USD",
    pricePerKwh: 0.35,
    pricePerMinute: 0.0,
    pricePerSession: 0.0,
    taxRate: 0.0,
    validFrom: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    validTo: undefined,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "tariff-2",
    name: "Fast DC",
    description: "DC fast charging",
    companyId: demoCompany.id,
    isActive: true,
    currency: "USD",
    pricePerKwh: 0.55,
    pricePerMinute: 0.0,
    pricePerSession: 1.0,
    taxRate: 0.0,
    validFrom: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    validTo: undefined,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

const firstDemoSession = demoSessions[0];
const firstDemoSessionStart = firstDemoSession?.startTimestamp ?? nowIso();
const firstDemoSessionEnd =
  firstDemoSession?.stopTimestamp ?? firstDemoSession?.startTimestamp ?? nowIso();

const demoConsumption: Consumption[] = [
  {
    id: "cons-1",
    transactionId: 5001,
    chargePointId: "CP-DEMO-0001",
    connectorId: 2,
    idTag: "RFID-1001",
    energyConsumed: 8.8,
    duration: 40,
    cost: 3.08,
    startTime: firstDemoSessionStart,
    endTime: firstDemoSessionEnd,
    createdAt: nowIso(),
  },
];

export const demoAuthApi = {
  signup: async (_data: SignupRequest): Promise<LoginResponse> => {
    return {
      success: true,
      message: "Demo signup successful",
      token: "demo-token",
      user: demoUsers[0]!,
    };
  },
  login: async (_credentials: LoginRequest): Promise<LoginResponse> => {
    return {
      success: true,
      message: "Demo login successful",
      token: "demo-token",
      user: demoUsers[0]!,
    };
  },
  logout: async (): Promise<void> => { },
  getCurrentUser: async (): Promise<User> => demoUsers[0]!,
};

export const demoCarsApi = {
  getCars: async (_filters?: unknown): Promise<Car[]> => demoCars,
  getMyCars: async (): Promise<Car[]> => demoCars.filter((c) => c.userId === demoUsers[0]!.id),
  getCarStats: async (): Promise<CarStats> => {
    const activeCars = demoCars.filter((c) => c.isActive).length;
    const inactiveCars = demoCars.length - activeCars;
    const byMake: Record<string, number> = {};
    const byChargingPort: Record<string, number> = {};

    for (const c of demoCars) {
      byMake[c.make] = (byMake[c.make] ?? 0) + 1;
      const port = c.chargingPort ?? "Other";
      byChargingPort[port] = (byChargingPort[port] ?? 0) + 1;
    }

    return {
      totalCars: demoCars.length,
      activeCars,
      inactiveCars,
      byMake,
      byChargingPort,
    };
  },
  getCarsByUser: async (userId: string): Promise<Car[]> => demoCars.filter((c) => c.userId === userId),
  getCarsByCompany: async (companyId: string): Promise<Car[]> => demoCars.filter((c) => c.companyId === companyId),
  getCarByLicensePlate: async (licensePlate: string): Promise<Car> => {
    const found = demoCars.find((c) => c.licensePlate === licensePlate);
    if (!found) throw new Error("Demo car not found");
    return found;
  },
  getCarById: async (carId: string): Promise<Car> => {
    const found = demoCars.find((c) => c.id === carId);
    if (!found) throw new Error("Demo car not found");
    return found;
  },
  createCar: async (data: CreateCarRequest): Promise<Car> => {
    const car: Car = {
      id: `car-${demoCars.length + 1}`,
      userId: data.userId ?? demoUsers[0]!.id,
      companyId: data.companyId ?? demoCompany.id,
      make: data.make,
      model: data.model,
      year: data.year,
      color: data.color,
      licensePlate: data.licensePlate,
      vin: data.vin,
      batteryCapacity: data.batteryCapacity,
      range: data.range,
      chargingPort: data.chargingPort,
      notes: data.notes,
      isActive: true,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    demoCars.unshift(car);
    return car;
  },
  updateCar: async (carId: string, data: UpdateCarRequest): Promise<Car> => {
    const idx = demoCars.findIndex((c) => c.id === carId);
    if (idx === -1) throw new Error("Demo car not found");
    const prev = demoCars[idx]!;
    const chargingPort =
      data.chargingPort !== undefined
        ? (data.chargingPort as Car["chargingPort"])
        : prev.chargingPort;

    const updated: Car = {
      ...prev,
      ...data,
      chargingPort,
      updatedAt: nowIso(),
    };
    demoCars[idx] = updated;
    return updated;
  },
  deleteCar: async (carId: string): Promise<void> => {
    const idx = demoCars.findIndex((c) => c.id === carId);
    if (idx !== -1) demoCars.splice(idx, 1);
  },
  deactivateCar: async (carId: string): Promise<Car> => {
    return demoCarsApi.updateCar(carId, { isActive: false });
  },
  activateCar: async (carId: string): Promise<Car> => {
    return demoCarsApi.updateCar(carId, { isActive: true });
  },
};

export const demoLocationApi = {
  getLocations: async (): Promise<ApiLocation[]> => demoApiLocations,
  getLocation: async (locationId: string): Promise<OcppLocation> => {
    const loc = demoOcppLocations.find((l) => l.id === locationId);
    if (!loc) throw new Error("Demo location not found");
    return loc;
  },
  getChargePointsForLocation: async (locationId: string): Promise<ChargePoint[]> => {
    return demoChargePoints.filter((cp) => cp.locationId === locationId);
  },
  createLocation: async (data: CreateLocationRequest): Promise<OcppLocation> => {
    const created: OcppLocation = {
      id: `loc-${demoApiLocations.length + 1}`,
      name: data.name,
      address: data.address,
      city: "Demo City",
      country: "US",
      zipCode: "94105",
      latitude: data.latitude,
      longitude: data.longitude,
      chargePoints: [],
      totalStations: 0,
      totalConnectors: 0,
    };

    demoApiLocations.unshift({
      id: created.id,
      name: created.name,
      address: created.address,
      description: data.description,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
    demoOcppLocations.unshift(created);
    return created;
  },
  updateLocation: async (locationId: string, data: UpdateLocationRequest): Promise<OcppLocation> => {
    const idx = demoOcppLocations.findIndex((l) => l.id === locationId);
    if (idx === -1) throw new Error("Demo location not found");

    const updated: OcppLocation = {
      ...demoOcppLocations[idx]!,
      ...("name" in data ? { name: data.name ?? demoOcppLocations[idx]!.name } : {}),
      ...("address" in data ? { address: data.address ?? demoOcppLocations[idx]!.address } : {}),
      ...("latitude" in data ? { latitude: data.latitude ?? demoOcppLocations[idx]!.latitude } : {}),
      ...("longitude" in data ? { longitude: data.longitude ?? demoOcppLocations[idx]!.longitude } : {}),
    };
    demoOcppLocations[idx] = updated;

    const apiIdx = demoApiLocations.findIndex((l) => l.id === locationId);
    if (apiIdx !== -1) {
      demoApiLocations[apiIdx] = {
        ...demoApiLocations[apiIdx]!,
        name: data.name ?? demoApiLocations[apiIdx]!.name,
        address: data.address ?? demoApiLocations[apiIdx]!.address,
        description: (data as any).description ?? demoApiLocations[apiIdx]!.description,
        updatedAt: nowIso(),
      };
    }

    return updated;
  },
  deleteLocation: async (locationId: string): Promise<void> => {
    const idx = demoOcppLocations.findIndex((l) => l.id === locationId);
    if (idx !== -1) demoOcppLocations.splice(idx, 1);
    const apiIdx = demoApiLocations.findIndex((l) => l.id === locationId);
    if (apiIdx !== -1) demoApiLocations.splice(apiIdx, 1);
  },
};

export const demoChargePointApi = {
  getLocations: async (): Promise<OcppLocation[]> => demoOcppLocations,
  getLocation: async (locationId: string): Promise<OcppLocation> => demoLocationApi.getLocation(locationId),
  resetChargePoint: async (chargePointId: string, type: ResetType): Promise<RemoteCommand> => {
    return {
      id: `cmd-reset-${Date.now()}`,
      chargePointId,
      command: "Reset",
      status: "Accepted",
      payload: { type },
      createdAt: nowIso(),
    };
  },
  getChargePointById: async (chargePointId: string): Promise<ChargePoint> => {
    return demoChargePointApi.getChargePoint(chargePointId);
  },
  createChargePoint: async (data: {
    name: string;
    chargePointId: string;
    locationId: string;
    model?: string;
    vendor?: string;
    ocppVersion?: string;
    connectorCount?: number;
  }): Promise<ChargePoint> => {
    const locationName = demoApiLocations.find((l) => l.id === data.locationId)?.name ?? "Unknown";
    const connectors = Array.from({ length: Math.max(1, data.connectorCount ?? 1) }, (_, i) =>
      makeConnector(`cp-${demoChargePoints.length + 1}`, i + 1, "Available" as ConnectorStatus)
    );
    const cp: ChargePoint = {
      id: `cp-${demoChargePoints.length + 1}`,
      chargePointId: data.chargePointId,
      name: data.name,
      locationId: data.locationId,
      locationName,
      model: data.model,
      vendor: data.vendor,
      status: "Available" as ChargePointStatus,
      connectors,
      lastHeartbeat: nowIso(),
      ocppVersion: data.ocppVersion ?? "1.6",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    demoChargePoints.unshift(cp);
    return cp;
  },
  getChargePoints: async (params?: {
    companyId?: string;
    locationId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ChargePoint>> => {
    const filtered = params?.locationId
      ? demoChargePoints.filter((cp) => cp.locationId === params.locationId)
      : demoChargePoints;
    return paginate(filtered, params?.page ?? 1, params?.limit ?? 20);
  },
  getChargePoint: async (chargePointId: string): Promise<ChargePoint> => {
    const found = demoChargePoints.find((cp) => cp.id === chargePointId || cp.chargePointId === chargePointId);
    if (!found) throw new Error("Demo charge point not found");
    return found;
  },
  updateChargePoint: async (chargePointId: string, data: Partial<{ name: string; locationId: string; model: string; vendor: string; ocppVersion: string; }>): Promise<ChargePoint> => {
    const idx = demoChargePoints.findIndex((cp) => cp.id === chargePointId);
    if (idx === -1) throw new Error("Demo charge point not found");
    const locationName = data.locationId
      ? demoApiLocations.find((l) => l.id === data.locationId)?.name ?? demoChargePoints[idx]!.locationName
      : demoChargePoints[idx]!.locationName;

    const updated: ChargePoint = {
      ...demoChargePoints[idx]!,
      ...data,
      locationName,
      updatedAt: nowIso(),
    };
    demoChargePoints[idx] = updated;
    return updated;
  },
  getConnector: async (chargePointId: string, connectorId: number): Promise<Connector> => {
    const cp = await demoChargePointApi.getChargePoint(chargePointId);
    const conn = cp.connectors.find((c) => c.connectorId === connectorId);
    if (!conn) throw new Error("Demo connector not found");
    return conn;
  },
  remoteStartTransaction: async (chargePointId: string, connectorId: number, idTag: string): Promise<RemoteCommand> => {
    return {
      id: `cmd-start-${Date.now()}`,
      chargePointId,
      command: "RemoteStartTransaction",
      status: "Accepted",
      payload: { connectorId, idTag },
      createdAt: nowIso(),
    };
  },
  remoteStopTransaction: async (chargePointId: string, transactionId: number): Promise<RemoteCommand> => {
    return {
      id: `cmd-stop-${Date.now()}`,
      chargePointId,
      command: "RemoteStopTransaction",
      status: "Accepted",
      payload: { transactionId },
      createdAt: nowIso(),
    };
  },
  reset: async (chargePointId: string, type: "Hard" | "Soft"): Promise<RemoteCommand> => {
    return demoChargePointApi.resetChargePoint(chargePointId, type as unknown as ResetType);
  },
  changeAvailability: async (chargePointId: string, connectorId: number, type: "Inoperative" | "Operative"): Promise<RemoteCommand> => {
    return {
      id: `cmd-avail-${Date.now()}`,
      chargePointId,
      command: "ChangeAvailability",
      status: "Accepted",
      payload: { connectorId, type },
      createdAt: nowIso(),
    };
  },
  unlockConnector: async (chargePointId: string, connectorId: number): Promise<RemoteCommand> => {
    return {
      id: `cmd-unlock-${Date.now()}`,
      chargePointId,
      command: "UnlockConnector",
      status: "Accepted",
      payload: { connectorId },
      createdAt: nowIso(),
      result: { status: "Accepted" },
    };
  },
  getRemoteCommands: async (params?: {
    chargePointId?: string;
    status?: "Pending" | "Accepted" | "Rejected" | "Timeout";
    limit?: number;
  }): Promise<RemoteCommand[]> => {
    let commands = [...demoRemoteCommands];

    if (params?.chargePointId) {
      commands = commands.filter((cmd) => cmd.chargePointId === params.chargePointId);
    }

    if (params?.status) {
      commands = commands.filter((cmd) => cmd.status === params.status);
    }

    commands.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (params?.limit != null) {
      commands = commands.slice(0, params.limit);
    }

    return commands;
  },
  getChargePointCommands: async (chargePointId: string, limit = 50): Promise<RemoteCommand[]> => {
    return demoChargePointApi.getRemoteCommands({ chargePointId, limit });
  },
};

export const demoTransactionApi = {
  getTransactions: async (params?: {
    chargePointId?: string;
    status?: "Active" | "Completed";
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Transaction>> => {
    let tx: Transaction[] = demoSessions.map((s) => ({
      id: s.id,
      transactionId: s.transactionId,
      chargePointId: s.chargePointId,
      connectorId: s.connectorId,
      idTag: s.idTag,
      startTimestamp: s.startTimestamp,
      stopTimestamp: s.stopTimestamp,
      meterStart: s.meterStart,
      meterStop: s.meterStop,
      status: s.status,
      userId: s.userId,
      userName: s.userName,
    }));

    if (params?.chargePointId) {
      tx = tx.filter((t) => t.chargePointId === params.chargePointId);
    }
    if (params?.status) {
      tx = tx.filter((t) => t.status === params.status);
    }

    return paginate(tx, params?.page ?? 1, params?.limit ?? 20);
  },
  getTransaction: async (transactionId: string): Promise<Transaction> => {
    const res = (await demoTransactionApi.getTransactions()).data.find((t) => String(t.transactionId) === transactionId);
    if (!res) throw new Error("Demo transaction not found");
    return res;
  },
  getSessionsByCompany: async (companyId: string, _signal?: AbortSignal): Promise<PaginatedResponse<Transaction>> => {
    const tx = (await demoTransactionApi.getTransactions()).data;
    if (!companyId) {
      return paginate(tx, 1, 50);
    }
    return paginate(tx, 1, 50);
  },
  getSessions: async (params?: {
    locationId?: string;
    chargePointId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Session>> => {
    let list = [...demoSessions];

    if (params?.chargePointId) {
      list = list.filter((s) => s.chargePointId === params.chargePointId);
    }

    if (params?.startDate) {
      const start = new Date(params.startDate).getTime();
      list = list.filter((s) => new Date(s.startTimestamp).getTime() >= start);
    }

    if (params?.endDate) {
      const end = new Date(params.endDate).getTime();
      list = list.filter((s) => new Date(s.startTimestamp).getTime() <= end);
    }

    return paginate(list, params?.page ?? 1, params?.limit ?? 20);
  },
  getLocationStats: async (_locationId: string, _period: "1W" | "1M" | "3M" | "1Y" | "ALL"): Promise<{ activeSessions: number; totalSessions: number; totalKwh: number; totalRevenue: number; }> => {
    return { activeSessions: 2, totalSessions: 92, totalKwh: 12450, totalRevenue: 6234 };
  },
  getLocationSessionsChart: async (_locationId: string, _period: "1W" | "1M" | "3M" | "1Y" | "ALL"): Promise<Array<{ time: string; activeSessions: number }>> => {
    return Array.from({ length: 12 }, (_, i) => ({ time: `T-${11 - i}`, activeSessions: Math.max(0, Math.round(10 + Math.sin(i) * 6)) }));
  },
  getEvents: async (params?: { chargePointId?: string; limit?: number }): Promise<Event[]> => {
    let list = [...demoEvents];
    if (params?.chargePointId) {
      list = list.filter((e) => e.chargePointId === params.chargePointId);
    }
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    if (params?.limit != null) {
      list = list.slice(0, params.limit);
    }
    return list;
  },
};

export const demoReservationApi = {
  getReservations: async (filters?: ReservationFilters): Promise<PaginatedResponse<Reservation>> => {
    const filtered = filters?.status ? demoReservations.filter((r) => r.status === filters.status) : demoReservations;
    return paginate(filtered, filters?.page ?? 1, filters?.limit ?? 20);
  },
  getReservation: async (reservationId: number): Promise<Reservation> => {
    const found = demoReservations.find((r) => r.reservationId === reservationId);
    if (!found) throw new Error("Demo reservation not found");
    return found;
  },
  createReservation: async (data: CreateReservationRequest): Promise<Reservation> => {
    const created: Reservation = {
      reservationId: Math.max(...demoReservations.map((r) => r.reservationId)) + 1,
      chargePointId: data.chargePointId,
      connectorId: data.connectorId,
      idTag: data.idTag,
      status: "Active",
      expiryDate: data.expiryDate,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    demoReservations.unshift(created);
    return created;
  },
  cancelReservation: async (reservationId: number) => {
    const idx = demoReservations.findIndex((r) => r.reservationId === reservationId);
    if (idx === -1) {
      return { data: demoReservations[0]!, message: "Not found" };
    }
    demoReservations[idx] = {
      ...demoReservations[idx]!,
      status: "Cancelled",
      cancelledAt: nowIso(),
      cancelledBy: demoUsers[0]!.name,
      updatedAt: nowIso(),
    };
    return { data: demoReservations[idx]!, message: "Cancelled" };
  },
  deleteReservation: async (_reservationId: number): Promise<void> => { },
  getReservationsByChargePoint: async (chargePointId: string): Promise<Reservation[]> => demoReservations.filter((r) => r.chargePointId === chargePointId),
  getReservationsByIdTag: async (idTag: string): Promise<Reservation[]> => demoReservations.filter((r) => r.idTag === idTag),
  validateReservation: async (_data: ValidateReservationRequest): Promise<ValidateReservationResponse> => {
    return { valid: true, message: "Demo: valid" };
  },
  expireOldReservations: async () => ({ data: { count: 0 }, message: "Demo" }),
};

export const demoCompanyApi = {
  getAllCompanies: async (): Promise<Company[]> => [demoCompany],
  getCompanyByName: async (_name: string): Promise<Company> => demoCompany,
  getCompanyById: async (_companyId: string): Promise<Company> => demoCompany,
  createCompany: async (data: { name: string; address: string }): Promise<Company> => {
    return { ...demoCompany, id: `demo-company-${Date.now()}`, name: data.name, address: data.address, updatedAt: nowIso() };
  },
  updateCompany: async (_companyId: string, data: Partial<Company>): Promise<Company> => ({ ...demoCompany, ...data, updatedAt: nowIso() }),
};

export const demoUsersApi = {
  getAllUsers: async (): Promise<User[]> => demoUsers,
  createUser: async (data: CreateUserRequest): Promise<User> => {
    const user: User = {
      id: `user-${demoUsers.length + 1}`,
      name: data.name,
      email: data.email,
      role: data.role ?? "User",
      companyId: data.companyId ?? demoCompany.id,
    };
    demoUsers.unshift(user);
    return user;
  },
};

export const demoTariffApi = {
  getTariffs: async (_filters?: TariffFilters): Promise<Tariff[]> => demoTariffs,
  getTariffById: async (id: string): Promise<Tariff> => {
    const found = demoTariffs.find((t) => t.id === id);
    if (!found) throw new Error("Demo tariff not found");
    return found;
  },
  getTariffsByCompany: async (_companyId: string, _filters?: unknown): Promise<Tariff[]> => demoTariffs,
  getActiveTariffForConnector: async (): Promise<Tariff | null> => demoTariffs[0] ?? null,
  getPriceForConnector: async (): Promise<{ pricePerKwh?: number; pricePerMinute?: number; pricePerSession?: number; currency: string }> => {
    const t = demoTariffs[0];
    return {
      pricePerKwh: t?.pricePerKwh,
      pricePerMinute: t?.pricePerMinute,
      pricePerSession: t?.pricePerSession,
      currency: t?.currency ?? "USD",
    };
  },
  createTariff: async (data: CreateTariffRequest): Promise<Tariff> => {
    const created: Tariff = {
      id: `tariff-${demoTariffs.length + 1}`,
      name: data.name,
      description: data.description,
      companyId: data.companyId,
      chargePointId: data.chargePointId,
      connectorId: data.connectorId,
      currency: data.currency,
      pricePerKwh: data.pricePerKwh,
      pricePerMinute: data.pricePerMinute,
      pricePerSession: data.pricePerSession,
      taxRate: data.taxRate,
      validFrom: data.validFrom,
      validTo: data.validTo,
      isActive: true,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    demoTariffs.unshift(created);
    return created;
  },
  updateTariff: async (id: string, data: Partial<CreateTariffRequest>): Promise<Tariff> => {
    const idx = demoTariffs.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Demo tariff not found");
    demoTariffs[idx] = { ...demoTariffs[idx]!, ...data, updatedAt: nowIso() };
    return demoTariffs[idx]!;
  },
  updateTariffForConnector: async (_chargePointId: string, _connectorId: string, data: Partial<CreateTariffRequest>): Promise<Tariff> => {
    const first = demoTariffs[0];
    if (!first) throw new Error("Demo tariff not found");
    return demoTariffApi.updateTariff(first.id, data);
  },
  deleteTariff: async (_id: string): Promise<void> => { },
  deactivateTariff: async (id: string): Promise<Tariff> => demoTariffApi.updateTariff(id, { isActive: false } as unknown as Partial<CreateTariffRequest>),
};

export const demoConsumptionApi = {
  getAllConsumption: async (): Promise<Consumption[]> => demoConsumption,
  getConsumptionById: async (id: string): Promise<Consumption> => {
    const found = demoConsumption.find((c) => c.id === id);
    if (!found) throw new Error("Demo consumption not found");
    return found;
  },
};

const demoFleets: Fleet[] = [
  {
    id: "fleet-1",
    companyId: demoCompany.id,
    name: "Corporate Fleet",
    description: "Main corporate vehicle fleet for executive and sales teams",
    manager: "Sarah Johnson",
    managerEmail: "sarah.johnson@demo-fleet.co",
    managerPhone: "+1 555 0201",
    status: "Active",
    vehicleCount: 12,
    driverCount: 15,
    totalEnergyConsumed: 4850,
    totalSessions: 342,
    averageEfficiency: 4.2,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: nowIso(),
  },
  {
    id: "fleet-2",
    companyId: demoCompany.id,
    name: "Delivery Fleet",
    description: "Last-mile delivery vehicles for urban operations",
    manager: "Mike Chen",
    managerEmail: "mike.chen@demo-fleet.co",
    managerPhone: "+1 555 0202",
    status: "Active",
    vehicleCount: 25,
    driverCount: 30,
    totalEnergyConsumed: 8920,
    totalSessions: 756,
    averageEfficiency: 3.8,
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: nowIso(),
  },
  {
    id: "fleet-3",
    companyId: demoCompany.id,
    name: "Service Fleet",
    description: "Field service and maintenance vehicles",
    manager: "Lisa Park",
    managerEmail: "lisa.park@demo-fleet.co",
    managerPhone: "+1 555 0203",
    status: "Active",
    vehicleCount: 8,
    driverCount: 10,
    totalEnergyConsumed: 2340,
    totalSessions: 198,
    averageEfficiency: 4.5,
    createdAt: "2024-03-10T10:00:00Z",
    updatedAt: nowIso(),
  },
];

const demoFleetVehicles: FleetVehicle[] = [
  {
    id: "fv-1",
    fleetId: "fleet-1",
    carId: "car-1",
    assignedDriverId: "user-1",
    assignedDriverName: "Alex Morgan",
    status: "Available",
    currentLocation: "Downtown Station",
    lastChargeAt: "2024-03-11T14:30:00Z",
    batteryLevel: 85,
    odometer: 12450,
    totalEnergyConsumed: 450,
    totalSessions: 32,
    assignedAt: "2024-01-15T10:00:00Z",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: nowIso(),
  },
  {
    id: "fv-2",
    fleetId: "fleet-1",
    carId: "car-2",
    assignedDriverId: "user-2",
    assignedDriverName: "Sam Lee",
    status: "In Use",
    currentLocation: "Airport Hub",
    lastChargeAt: "2024-03-11T08:00:00Z",
    batteryLevel: 62,
    odometer: 8920,
    totalEnergyConsumed: 380,
    totalSessions: 28,
    assignedAt: "2024-01-20T10:00:00Z",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: nowIso(),
  },
  {
    id: "fv-3",
    fleetId: "fleet-2",
    carId: "car-3",
    status: "Charging",
    currentLocation: "Warehouse District",
    lastChargeAt: nowIso(),
    batteryLevel: 45,
    odometer: 15680,
    totalEnergyConsumed: 620,
    totalSessions: 45,
    assignedAt: "2024-02-01T10:00:00Z",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: nowIso(),
  },
];

const demoFleetDrivers: FleetDriver[] = [
  {
    id: "fd-1",
    fleetId: "fleet-1",
    userId: "user-1",
    userName: "Alex Morgan",
    userEmail: "alex@demo-fleet.co",
    licenseNumber: "D1234567",
    licenseExpiry: "2026-12-31",
    assignedVehicleId: "fv-1",
    assignedVehicleName: "Tesla Model 3 - ABC123",
    status: "Active",
    totalSessions: 32,
    totalEnergyConsumed: 450,
    assignedAt: "2024-01-15T10:00:00Z",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: nowIso(),
  },
  {
    id: "fd-2",
    fleetId: "fleet-1",
    userId: "user-2",
    userName: "Sam Lee",
    userEmail: "sam@demo-fleet.co",
    licenseNumber: "D7654321",
    licenseExpiry: "2025-08-15",
    assignedVehicleId: "fv-2",
    assignedVehicleName: "Nissan Leaf - XYZ789",
    status: "Active",
    totalSessions: 28,
    totalEnergyConsumed: 380,
    assignedAt: "2024-01-20T10:00:00Z",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: nowIso(),
  },
];

export const demoFleetApi = {
  getAllFleets: async (_companyId: string): Promise<Fleet[]> => demoFleets,
  getFleetById: async (id: string): Promise<Fleet> => {
    const found = demoFleets.find((f) => f.id === id);
    if (!found) throw new Error("Demo fleet not found");
    return found;
  },
  createFleet: async (_companyId: string, data: CreateFleetRequest): Promise<Fleet> => {
    const fleet: Fleet = {
      id: `fleet-${demoFleets.length + 1}`,
      companyId: demoCompany.id,
      name: data.name,
      description: data.description,
      manager: data.manager,
      managerEmail: data.managerEmail,
      managerPhone: data.managerPhone,
      status: data.status ?? "Active",
      vehicleCount: 0,
      driverCount: 0,
      totalEnergyConsumed: 0,
      totalSessions: 0,
      averageEfficiency: 0,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    demoFleets.unshift(fleet);
    return fleet;
  },
  updateFleet: async (id: string, data: UpdateFleetRequest): Promise<Fleet> => {
    const idx = demoFleets.findIndex((f) => f.id === id);
    if (idx === -1) throw new Error("Demo fleet not found");
    demoFleets[idx] = { ...demoFleets[idx]!, ...data, updatedAt: nowIso() };
    return demoFleets[idx]!;
  },
  deleteFleet: async (_id: string): Promise<void> => { },
  getFleetVehicles: async (fleetId: string): Promise<FleetVehicle[]> => {
    return demoFleetVehicles.filter((v) => v.fleetId === fleetId);
  },
  assignVehicleToFleet: async (fleetId: string, data: AssignVehicleToFleetRequest): Promise<FleetVehicle> => {
    const vehicle: FleetVehicle = {
      id: `fv-${demoFleetVehicles.length + 1}`,
      fleetId,
      carId: data.carId,
      assignedDriverId: data.assignedDriverId,
      status: data.status ?? "Available",
      batteryLevel: 100,
      odometer: 0,
      totalEnergyConsumed: 0,
      totalSessions: 0,
      assignedAt: nowIso(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    demoFleetVehicles.unshift(vehicle);
    return vehicle;
  },
  updateFleetVehicle: async (_fleetId: string, vehicleId: string, data: UpdateFleetVehicleRequest): Promise<FleetVehicle> => {
    const idx = demoFleetVehicles.findIndex((v) => v.id === vehicleId);
    if (idx === -1) throw new Error("Demo fleet vehicle not found");
    demoFleetVehicles[idx] = { ...demoFleetVehicles[idx]!, ...data, updatedAt: nowIso() };
    return demoFleetVehicles[idx]!;
  },
  removeVehicleFromFleet: async (_fleetId: string, _vehicleId: string): Promise<void> => { },
  getFleetDrivers: async (fleetId: string): Promise<FleetDriver[]> => {
    return demoFleetDrivers.filter((d) => d.fleetId === fleetId);
  },
  assignDriverToFleet: async (fleetId: string, data: AssignDriverToFleetRequest): Promise<FleetDriver> => {
    const driver: FleetDriver = {
      id: `fd-${demoFleetDrivers.length + 1}`,
      fleetId,
      userId: data.userId,
      userName: "Demo Driver",
      userEmail: "driver@demo-fleet.co",
      licenseNumber: data.licenseNumber,
      licenseExpiry: data.licenseExpiry,
      status: data.status ?? "Active",
      totalSessions: 0,
      totalEnergyConsumed: 0,
      assignedAt: nowIso(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    demoFleetDrivers.unshift(driver);
    return driver;
  },
  updateFleetDriver: async (_fleetId: string, driverId: string, data: UpdateFleetDriverRequest): Promise<FleetDriver> => {
    const idx = demoFleetDrivers.findIndex((d) => d.id === driverId);
    if (idx === -1) throw new Error("Demo fleet driver not found");
    demoFleetDrivers[idx] = { ...demoFleetDrivers[idx]!, ...data, updatedAt: nowIso() };
    return demoFleetDrivers[idx]!;
  },
  removeDriverFromFleet: async (_fleetId: string, _driverId: string): Promise<void> => { },
  getFleetStats: async (_companyId: string): Promise<FleetStats> => ({
    totalFleets: demoFleets.length,
    activeFleets: demoFleets.filter((f) => f.status === "Active").length,
    totalVehicles: demoFleetVehicles.length,
    availableVehicles: demoFleetVehicles.filter((v) => v.status === "Available").length,
    vehiclesInUse: demoFleetVehicles.filter((v) => v.status === "In Use").length,
    vehiclesCharging: demoFleetVehicles.filter((v) => v.status === "Charging").length,
    vehiclesInMaintenance: demoFleetVehicles.filter((v) => v.status === "Maintenance").length,
    totalDrivers: demoFleetDrivers.length,
    activeDrivers: demoFleetDrivers.filter((d) => d.status === "Active").length,
    totalEnergyConsumed: demoFleets.reduce((sum, f) => sum + (f.totalEnergyConsumed ?? 0), 0),
    totalSessions: demoFleets.reduce((sum, f) => sum + (f.totalSessions ?? 0), 0),
    averageEfficiency: 4.1,
  }),
  getFleetAnalytics: async (fleetId: string, period: "1W" | "1M" | "3M" | "1Y"): Promise<FleetAnalytics> => ({
    fleetId,
    period,
    energyConsumption: [
      { date: "2024-03-01", energyKwh: 450, sessions: 32 },
      { date: "2024-03-02", energyKwh: 520, sessions: 38 },
      { date: "2024-03-03", energyKwh: 480, sessions: 35 },
      { date: "2024-03-04", energyKwh: 510, sessions: 37 },
      { date: "2024-03-05", energyKwh: 490, sessions: 36 },
    ],
    vehicleUtilization: [
      { vehicleId: "fv-1", vehicleName: "Tesla Model 3", utilizationPercent: 85, sessions: 32, energyKwh: 450 },
      { vehicleId: "fv-2", vehicleName: "Nissan Leaf", utilizationPercent: 72, sessions: 28, energyKwh: 380 },
    ],
    driverPerformance: [
      { driverId: "fd-1", driverName: "Alex Morgan", sessions: 32, energyKwh: 450, efficiency: 4.2 },
      { driverId: "fd-2", driverName: "Sam Lee", sessions: 28, energyKwh: 380, efficiency: 4.0 },
    ],
    costAnalysis: {
      totalCost: 1245.50,
      costPerKwh: 0.25,
      costPerSession: 3.85,
      costPerVehicle: 103.79,
    },
  }),
};

export const demoCentralSystemApi = {
  changeAvailability: async (_chargePointId: string, _data: unknown): Promise<OCPPResponse> => ({ status: "Accepted" }),
  changeConfiguration: async (): Promise<OCPPResponse> => ({ status: "Accepted" }),
  clearCache: async (): Promise<OCPPResponse> => ({ status: "Accepted" }),
  getConfiguration: async (): Promise<OCPPResponse> => ({ status: "Accepted", data: {} }),
  remoteStartTransaction: async (): Promise<OCPPResponse> => ({ status: "Accepted" }),
  remoteStopTransaction: async (): Promise<OCPPResponse> => ({ status: "Accepted" }),
  reset: async (): Promise<OCPPResponse> => ({ status: "Accepted" }),
  unlockConnector: async (): Promise<OCPPResponse> => ({ status: "Accepted" }),
  getDiagnostics: async (): Promise<OCPPResponse> => ({ status: "Accepted" }),
  updateFirmware: async (): Promise<OCPPResponse> => ({ status: "Accepted" }),
  sendLocalList: async (): Promise<OCPPResponse> => ({ status: "Accepted" }),
  getLocalListVersion: async (): Promise<OCPPResponse> => ({ status: "Accepted", data: { version: 1 } }),
  reserveNow: async (): Promise<OCPPResponse> => ({ status: "Accepted" }),
  cancelReservation: async (): Promise<OCPPResponse> => ({ status: "Accepted" }),
  triggerMessage: async (): Promise<OCPPResponse> => ({ status: "Accepted" }),
  getTriggerMessageTypes: async (): Promise<string[]> => ["BootNotification", "Heartbeat", "StatusNotification"],
};

export const demoHealthApi = {
  check: async (): Promise<{ status: string }> => ({ status: "ok" }),
};

export const demoPaymentMethodsApi = {
  getPaymentMethods: async (): Promise<PaymentMethod[]> => [],
  createPaymentMethod: async (): Promise<PaymentMethod> => {
    throw new Error("Demo payment methods not implemented");
  },
  getMyPaymentMethods: async (): Promise<PaymentMethod[]> => [],
  getActivePaymentMethod: async (): Promise<PaymentMethod | null> => null,
  checkPaymentEligibility: async (): Promise<PaymentEligibility> => ({
    hasActivePaymentMethod: false,
    eligibleToCharge: false,
    message: "No active payment method in demo",
  }),
  getPaymentMethodStats: async (): Promise<PaymentMethodStats> => ({
    total: 0,
    active: 0,
    inactive: 0,
    expired: 0,
    failed: 0,
    pending: 0,
    byType: {},
    byProvider: {},
  }),
  getPaymentMethodsByUser: async (): Promise<PaymentMethod[]> => [],
  expireOldPaymentMethods: async (): Promise<{ count: number }> => ({ count: 0 }),
  getPaymentMethodById: async (): Promise<PaymentMethod> => {
    throw new Error("Demo payment method not found");
  },
  updatePaymentMethod: async (): Promise<PaymentMethod> => {
    throw new Error("Demo payment methods not implemented");
  },
  deletePaymentMethod: async (): Promise<void> => {},
  setActive: async (): Promise<PaymentMethod> => {
    throw new Error("Demo payment methods not implemented");
  },
  verify: async (): Promise<PaymentMethod> => {
    throw new Error("Demo payment methods not implemented");
  },
  deactivate: async (): Promise<PaymentMethod> => {
    throw new Error("Demo payment methods not implemented");
  },
};
