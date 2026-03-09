import { apiClient } from "./axios";
import type {
  ChangeAvailabilityRequest,
  ChangeConfigurationRequest,
  RemoteStartTransactionRequest,
  RemoteStopTransactionRequest,
  ResetRequest,
  UnlockConnectorRequest,
  GetDiagnosticsRequest,
  UpdateFirmwareRequest,
  SendLocalListRequest,
  ReserveNowRequest,
  CancelReservationRequest,
  TriggerMessageRequest,
  OCPPResponse,
} from "@/types/api";

export const centralSystemApi = {
  changeAvailability: async (
    chargePointId: string,
    data: ChangeAvailabilityRequest
  ): Promise<OCPPResponse> => {
    const response = await apiClient.post<OCPPResponse>(
      `/central-system/charge-points/${chargePointId}/change-availability`,
      data
    );
    return response.data;
  },

  changeConfiguration: async (
    chargePointId: string,
    data: ChangeConfigurationRequest
  ): Promise<OCPPResponse> => {
    const response = await apiClient.post<OCPPResponse>(
      `/central-system/charge-points/${chargePointId}/change-configuration`,
      data
    );
    return response.data;
  },

  clearCache: async (chargePointId: string): Promise<OCPPResponse> => {
    const response = await apiClient.post<OCPPResponse>(
      `/central-system/charge-points/${chargePointId}/clear-cache`
    );
    return response.data;
  },

  getConfiguration: async (
    chargePointId: string,
    keys?: string
  ): Promise<OCPPResponse> => {
    const response = await apiClient.get<OCPPResponse>(
      `/central-system/charge-points/${chargePointId}/get-configuration`,
      { params: { keys } }
    );
    return response.data;
  },

  remoteStartTransaction: async (
    chargePointId: string,
    data: RemoteStartTransactionRequest
  ): Promise<OCPPResponse> => {
    const response = await apiClient.post<OCPPResponse>(
      `/central-system/charge-points/${chargePointId}/remote-start-transaction`,
      data
    );
    return response.data;
  },

  remoteStopTransaction: async (
    chargePointId: string,
    data: RemoteStopTransactionRequest
  ): Promise<OCPPResponse> => {
    const response = await apiClient.post<OCPPResponse>(
      `/central-system/charge-points/${chargePointId}/remote-stop-transaction`,
      data
    );
    return response.data;
  },

  reset: async (
    chargePointId: string,
    data: ResetRequest
  ): Promise<OCPPResponse> => {
    const response = await apiClient.post<OCPPResponse>(
      `/central-system/charge-points/${chargePointId}/reset`,
      data
    );
    return response.data;
  },

  unlockConnector: async (
    chargePointId: string,
    data: UnlockConnectorRequest
  ): Promise<OCPPResponse> => {
    const response = await apiClient.post<OCPPResponse>(
      `/central-system/charge-points/${chargePointId}/unlock-connector`,
      data
    );
    return response.data;
  },

  getDiagnostics: async (
    chargePointId: string,
    data: GetDiagnosticsRequest
  ): Promise<OCPPResponse> => {
    const response = await apiClient.post<OCPPResponse>(
      `/central-system/charge-points/${chargePointId}/get-diagnostics`,
      data
    );
    return response.data;
  },

  updateFirmware: async (
    chargePointId: string,
    data?: UpdateFirmwareRequest
  ): Promise<OCPPResponse> => {
    const response = await apiClient.post<OCPPResponse>(
      `/central-system/charge-points/${chargePointId}/update-firmware`,
      data
    );
    return response.data;
  },

  sendLocalList: async (
    chargePointId: string,
    data: SendLocalListRequest
  ): Promise<OCPPResponse> => {
    const response = await apiClient.post<OCPPResponse>(
      `/central-system/charge-points/${chargePointId}/send-local-list`,
      data
    );
    return response.data;
  },

  getLocalListVersion: async (
    chargePointId: string
  ): Promise<OCPPResponse> => {
    const response = await apiClient.get<OCPPResponse>(
      `/central-system/charge-points/${chargePointId}/get-local-list-version`
    );
    return response.data;
  },

  reserveNow: async (
    chargePointId: string,
    data: ReserveNowRequest
  ): Promise<OCPPResponse> => {
    const response = await apiClient.post<OCPPResponse>(
      `/central-system/charge-points/${chargePointId}/reserve-now`,
      data
    );
    return response.data;
  },

  cancelReservation: async (
    chargePointId: string,
    data: CancelReservationRequest
  ): Promise<OCPPResponse> => {
    const response = await apiClient.post<OCPPResponse>(
      `/central-system/charge-points/${chargePointId}/cancel-reservation`,
      data
    );
    return response.data;
  },

  triggerMessage: async (
    chargePointId: string,
    data: TriggerMessageRequest
  ): Promise<OCPPResponse> => {
    const response = await apiClient.post<OCPPResponse>(
      `/central-system/charge-points/${chargePointId}/trigger-message`,
      data
    );
    return response.data;
  },

  getTriggerMessageTypes: async (
    chargePointId: string
  ): Promise<string[]> => {
    const response = await apiClient.get<string[]>(
      `/central-system/charge-points/${chargePointId}/trigger-message-types`
    );
    return response.data;
  },
};
