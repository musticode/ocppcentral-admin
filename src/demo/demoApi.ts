import type {
  Car,
  CarStats,
  Company,
  Consumption,
  CreateCarRequest,
  CreateLocationRequest,
  CreateReservationRequest,
  CreateTariffRequest,
  CreateUserRequest,
  Location as ApiLocation,
  LoginRequest,
  LoginResponse,
  PaginatedResponse,
  Reservation,
  ReservationFilters,
  SignupRequest,
  Tariff,
  TariffFilters,
  UpdateCarRequest,
  UpdateLocationRequest,
  User,
  ValidateReservationRequest,
  ValidateReservationResponse,
  OCPPResponse,
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
  return {
    id: `${chargePointId}-conn-${connectorId}`,
    connectorId,
    chargePointId,
    status,
    type: connectorId % 2 === 0 ? "CCS" : "Type 2",
    powerKw: connectorId % 2 === 0 ? 60 : 22,
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
  {
    id: "sess-1",
    transactionId: 5001,
    chargePointId: "CP-DEMO-0001",
    connectorId: 2,
    idTag: "RFID-1001",
    startTimestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    stopTimestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    meterStart: 12000,
    meterStop: 12880,
    status: "Completed" as TransactionStatus,
    userId: "user-1",
    userName: "Alex Morgan",
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
};

export const demoTransactionApi = {
  getTransactions: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Transaction>> => {
    const tx: Transaction[] = demoSessions.map((s) => ({
      id: s.id,
      transactionId: s.transactionId,
      chargePointId: s.chargePointId,
      connectorId: s.connectorId,
      idTag: s.idTag,
      startTimestamp: s.startTimestamp,
      stopTimestamp: s.stopTimestamp,
      meterStart: s.meterStart,
      meterStop: s.meterStop,
      status: s.status as unknown as TransactionStatus,
      userId: s.userId,
      userName: s.userName,
    }));
    return paginate(tx, params?.page ?? 1, params?.limit ?? 20);
  },
  getTransaction: async (transactionId: string): Promise<Transaction> => {
    const res = (await demoTransactionApi.getTransactions()).data.find((t) => String(t.transactionId) === transactionId);
    if (!res) throw new Error("Demo transaction not found");
    return res;
  },
  getSessionsByCompany: async (companyId: string, _signal?: AbortSignal): Promise<PaginatedResponse<Transaction>> => {
    const tx = (await demoTransactionApi.getTransactions()).data;
    const filtered = tx.filter((_t) => !!companyId);
    return paginate(filtered, 1, 50);
  },
  getSessions: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Session>> => {
    return paginate(demoSessions, params?.page ?? 1, params?.limit ?? 20);
  },
  getLocationStats: async (_locationId: string, _period: "1W" | "1M" | "3M" | "1Y" | "ALL"): Promise<{ activeSessions: number; totalSessions: number; totalKwh: number; totalRevenue: number; }> => {
    return { activeSessions: 2, totalSessions: 92, totalKwh: 12450, totalRevenue: 6234 };
  },
  getLocationSessionsChart: async (_locationId: string, _period: "1W" | "1M" | "3M" | "1Y" | "ALL"): Promise<Array<{ time: string; activeSessions: number }>> => {
    return Array.from({ length: 12 }, (_, i) => ({ time: `T-${11 - i}`, activeSessions: Math.max(0, Math.round(10 + Math.sin(i) * 6)) }));
  },
  getEvents: async (_params?: { chargePointId?: string; limit?: number }): Promise<Event[]> => demoEvents,
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
