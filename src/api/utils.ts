/**
 * Normalize an API response that may be a plain array or a wrapper object
 * like { data: [...] }, { success: true, data: [...] }, etc.
 */
export function extractArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as T[];
  }
  return [];
}

/**
 * Normalize a Car object from backend format to frontend format.
 * Backend may use 'carId' or '_id' instead of 'id'.
 * Backend may also populate userId/companyId as objects instead of strings.
 */
export function normalizeCar(car: any): any {
  if (!car) return car;

  // Extract from { success: true, data: {...} } wrapper if present
  const rawCar = car.data || car;

  return {
    ...rawCar,
    id: rawCar._id || rawCar.id || rawCar.carId,
    // Extract string IDs from populated objects
    userId: typeof rawCar.userId === 'object' ? rawCar.userId?._id : rawCar.userId,
    companyId: typeof rawCar.companyId === 'object' ? rawCar.companyId?._id : rawCar.companyId,
  };
}

export function normalizeFleet(fleet: any): any {
  if (!fleet) return fleet;

  // Extract from { success: true, data: {...} } wrapper if present
  const rawFleet = fleet.data || fleet;

  // Normalize nested location.address if it's an object
  const loc = rawFleet.location;
  const normalizedLocation = loc ? {
    ...loc,
    address: typeof loc.address === 'object' ? loc.address?.address : loc.address,
  } : loc;

  return {
    ...rawFleet,
    id: rawFleet._id || rawFleet.id || rawFleet.fleetId,
    location: normalizedLocation,
    // Extract string IDs from populated objects
    companyId: typeof rawFleet.companyId === 'object' ? rawFleet.companyId?._id : rawFleet.companyId,
    managerId: typeof rawFleet.managerId === 'object' ? rawFleet.managerId?._id : rawFleet.managerId,
  };
}

/**
 * Normalize a User object from backend format to frontend format.
 * Backend may use '_id' instead of 'id'.
 */
export function normalizeUser(user: any): any {
  if (!user) return user;

  const rawUser = user.data || user;

  return {
    ...rawUser,
    id: rawUser._id || rawUser.id,
    companyId: typeof rawUser.companyId === 'object' ? rawUser.companyId?._id : rawUser.companyId,
  };
}

/**
 * Normalize a ChargePoint object from backend format to frontend format.
 * Backend may use '_id' instead of 'id' and may populate locationId/companyId.
 */
export function normalizeChargePoint(chargePoint: any): any {
  if (!chargePoint) return chargePoint;

  // Extract from { success: true, data: {...} } wrapper if present
  const rawCP = chargePoint.data || chargePoint;

  return {
    ...rawCP,
    id: rawCP._id || rawCP.id,
    // Extract string IDs from populated objects
    locationId: typeof rawCP.locationId === 'object' ? rawCP.locationId?._id : rawCP.locationId,
    companyId: typeof rawCP.companyId === 'object' ? rawCP.companyId?._id : rawCP.companyId,
  };
}

/**
 * Safely extract a string from an address field that may be an object like { address, lastUpdated }.
 */
export function safeAddress(address: any): string {
  if (!address) return '';
  if (typeof address === 'string') return address;
  if (typeof address === 'object') return address.address ?? '';
  return String(address);
}

/**
 * Normalize a Location object from backend format to frontend format.
 * Backend may use '_id' instead of 'id' and may have a custom 'id' field like 'loc_001'.
 */
export function normalizeLocation(location: any): any {
  if (!location) return location;

  // Extract from { success: true, data: {...} } wrapper if present
  const rawLoc = location.data || location;

  return {
    ...rawLoc,
    id: rawLoc._id || rawLoc.id,
    // If address is an object like { address, lastUpdated }, extract the string
    address: typeof rawLoc.address === 'object' ? rawLoc.address?.address : rawLoc.address,
    // Extract string IDs from populated objects
    companyId: typeof rawLoc.companyId === 'object' ? rawLoc.companyId?._id : rawLoc.companyId,
  };
}
