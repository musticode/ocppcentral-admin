import type {
  ChargePoint,
  Connector,
  Location,
  RemoteCommand,
  ResetType,
} from "@/types/ocpp";

import type { PaginatedResponse } from "@/types/api";
import { apiClient } from "./axios";
import { extractArray } from "./utils";

export const chargePointApi = {
  listAllChargePoints: async (): Promise<ChargePoint[]> => {
    const response = await apiClient.get<unknown>(
      "/charge-points/listAllChargePoints"
    );
    return extractArray<ChargePoint>(response.data);
  },

  getLocations: async (): Promise<Location[]> => {
    const response = await apiClient.get<unknown>(
      "/locations/listAllLocations"
    );
    return extractArray<Location>(response.data);
  },

  getLocation: async (locationId: string): Promise<Location> => {
    const response = await apiClient.get<Location>(
      `/locations/${locationId}`
    );
    return response.data;
  },

  resetChargePoint: async (
    chargePointId: string,
    type: ResetType
  ): Promise<RemoteCommand> => {
    const response = await apiClient.post<RemoteCommand>(
      `/central-system/charge-points/${chargePointId}/reset`,
      { type }
    );
    return response.data;
  },

  getChargePointById: async (chargePointId: string): Promise<ChargePoint> => {
    const response = await apiClient.get<ChargePoint>(
      `/charge-points/${chargePointId}`
    );
    return response.data;
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
    const response = await apiClient.post<ChargePoint>(
      "/charge-points/createChargePoint",
      data
    );
    return response.data;
  },

  getChargePoints: async (params?: {
    companyId?: string;
    locationId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ChargePoint>> => {
    const response = await apiClient.get<unknown>(
      "/charge-points/listAllChargePoints",
      { params }
    );
    const payload = response.data;
    if (Array.isArray(payload)) {
      return { data: payload as ChargePoint[], total: payload.length, page: 1, limit: payload.length, totalPages: 1 };
    }
    if (payload && typeof payload === "object" && Array.isArray((payload as any).data)) {
      return payload as PaginatedResponse<ChargePoint>;
    }
    return { data: extractArray<ChargePoint>(payload), total: 0, page: 1, limit: 20, totalPages: 0 };
  },

  getChargePoint: async (chargePointId: string): Promise<ChargePoint> => {
    const response = await apiClient.get<ChargePoint>(
      `/charge-points/${chargePointId}`
    );
    return response.data;
  },

  updateChargePoint: async (
    chargePointId: string,
    data: Partial<{
      name: string;
      locationId: string;
      model: string;
      vendor: string;
      ocppVersion: string;
    }>
  ): Promise<ChargePoint> => {
    const response = await apiClient.put<ChargePoint>(
      `/charge-points/${chargePointId}`,
      data
    );
    return response.data;
  },

  deleteChargePoint: async (chargePointId: string): Promise<void> => {
    await apiClient.delete(`/charge-points/${chargePointId}`);
  },

  updateChargePointLocation: async (
    chargePointId: string,
    locationId: string | null
  ): Promise<ChargePoint> => {
    const response = await apiClient.put<ChargePoint>(
      `/charge-points/${chargePointId}/location`,
      { locationId }
    );
    return response.data;
  },

  getConnector: async (
    chargePointId: string,
    connectorId: number
  ): Promise<Connector> => {
    const response = await apiClient.get<Connector>(
      `/charge-points/${chargePointId}/connectors/${connectorId}`
    );
    return response.data;
  },

  remoteStartTransaction: async (
    chargePointId: string,
    connectorId: number,
    idTag: string
  ): Promise<RemoteCommand> => {
    const response = await apiClient.post<RemoteCommand>(
      `/central-system/charge-points/${chargePointId}/remote-start-transaction`,
      { connectorId, idTag }
    );
    return response.data;
  },

  remoteStopTransaction: async (
    chargePointId: string,
    transactionId: number
  ): Promise<RemoteCommand> => {
    const response = await apiClient.post<RemoteCommand>(
      `/central-system/charge-points/${chargePointId}/remote-stop-transaction`,
      { transactionId }
    );
    return response.data;
  },

  reset: async (
    chargePointId: string,
    type: "Hard" | "Soft"
  ): Promise<RemoteCommand> => {
    const response = await apiClient.post<RemoteCommand>(
      `/central-system/charge-points/${chargePointId}/reset`,
      { type }
    );
    return response.data;
  },

  changeAvailability: async (
    chargePointId: string,
    connectorId: number,
    type: "Inoperative" | "Operative"
  ): Promise<RemoteCommand> => {
    const response = await apiClient.post<RemoteCommand>(
      `/central-system/charge-points/${chargePointId}/change-availability`,
      { connectorId, type }
    );
    return response.data;
  },

  unlockConnector: async (
    chargePointId: string,
    connectorId: number
  ): Promise<RemoteCommand> => {
    const response = await apiClient.post<RemoteCommand>(
      `/central-system/charge-points/${chargePointId}/unlock-connector`,
      { connectorId }
    );
    return response.data;
  },

  getRemoteCommands: async (params?: {
    chargePointId?: string;
    status?: "Pending" | "Accepted" | "Rejected" | "Timeout";
    limit?: number;
  }): Promise<RemoteCommand[]> => {
    const response = await apiClient.get<unknown>(
      "/charge-points/commands",
      { params }
    );
    return extractArray<RemoteCommand>(response.data);
  },

  getChargePointCommands: async (
    chargePointId: string,
    limit = 50
  ): Promise<RemoteCommand[]> => {
    const response = await apiClient.get<unknown>(
      `/charge-points/${chargePointId}/commands`,
      { params: { limit } }
    );
    return extractArray<RemoteCommand>(response.data);
  },
};
