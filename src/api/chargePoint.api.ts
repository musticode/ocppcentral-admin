import { apiClient } from "./axios";
import type {
  ChargePoint,
  Location,
  Connector,
  RemoteCommand,
  ResetType,
} from "@/types/ocpp";
import type { PaginatedResponse } from "@/types/api";

export const chargePointApi = {
  getLocations: async (): Promise<Location[]> => {
    const response = await apiClient.get<Location[]>(
      "/charge-points/locations"
    );
    return response.data;
  },

  getLocation: async (locationId: string): Promise<Location> => {
    const response = await apiClient.get<Location>(
      `/charge-points/locations/${locationId}`
    );
    return response.data;
  },

  resetChargePoint: async (
    chargePointId: string,
    type: ResetType
  ): Promise<RemoteCommand> => {
    const response = await apiClient.post<RemoteCommand>(
      `/charge-points/${chargePointId}/reset`,
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
    const response = await apiClient.post<ChargePoint>("/charge-points", data);
    return response.data;
  },

  getChargePoints: async (params?: {
    companyId?: string;
    locationId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ChargePoint>> => {
    const response = await apiClient.get<PaginatedResponse<ChargePoint>>(
      `/charge-points/listAllChargePoints${params?.companyId}`,
      { params: { companyId: params?.companyId } }
    );
    console.log(response.data);
    return response.data;
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
    const response = await apiClient.patch<ChargePoint>(
      `/charge-points/${chargePointId}`,
      data
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
      `/charge-points/${chargePointId}/remote-start`,
      { connectorId, idTag }
    );
    return response.data;
  },

  remoteStopTransaction: async (
    chargePointId: string,
    transactionId: number
  ): Promise<RemoteCommand> => {
    const response = await apiClient.post<RemoteCommand>(
      `/charge-points/${chargePointId}/remote-stop`,
      { transactionId }
    );
    return response.data;
  },

  reset: async (
    chargePointId: string,
    type: "Hard" | "Soft"
  ): Promise<RemoteCommand> => {
    const response = await apiClient.post<RemoteCommand>(
      `/charge-points/${chargePointId}/reset`,
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
      `/charge-points/${chargePointId}/availability`,
      { connectorId, type }
    );
    return response.data;
  },
};
