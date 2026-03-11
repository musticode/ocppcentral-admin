import { authApi as realAuthApi } from "./auth.api";
import { chargePointApi as realChargePointApi } from "./chargePoint.api";
import { locationApi as realLocationApi } from "./location.api";
import { transactionApi as realTransactionApi } from "./transaction.api";
import { reportApi } from "./report.api";
import { reservationApi as realReservationApi } from "./reservation.api";
import { companyApi as realCompanyApi } from "./company.api";
import { tariffApi as realTariffApi } from "./tariff.api";
import { consumptionApi as realConsumptionApi } from "./consumption.api";
import { centralSystemApi as realCentralSystemApi } from "./centralSystem.api";
import { carsApi as realCarsApi } from "./cars.api";
import { usersApi as realUsersApi } from "./users.api";

import { isDemoMode } from "@/demo/demoMode";
import {
    demoAuthApi,
    demoCarsApi,
    demoCentralSystemApi,
    demoChargePointApi,
    demoCompanyApi,
    demoConsumptionApi,
    demoLocationApi,
    demoReservationApi,
    demoTariffApi,
    demoTransactionApi,
    demoUsersApi,
} from "@/demo/demoApi";

export const authApi = isDemoMode ? demoAuthApi : realAuthApi;
export const chargePointApi = isDemoMode ? demoChargePointApi : realChargePointApi;
export const locationApi = isDemoMode ? demoLocationApi : realLocationApi;
export const transactionApi = isDemoMode ? demoTransactionApi : realTransactionApi;
export const reservationApi = isDemoMode ? demoReservationApi : realReservationApi;
export const companyApi = isDemoMode ? demoCompanyApi : realCompanyApi;
export const tariffApi = isDemoMode ? demoTariffApi : realTariffApi;
export const consumptionApi = isDemoMode ? demoConsumptionApi : realConsumptionApi;
export const centralSystemApi = isDemoMode ? demoCentralSystemApi : realCentralSystemApi;
export const carsApi = isDemoMode ? demoCarsApi : realCarsApi;
export const usersApi = isDemoMode ? demoUsersApi : realUsersApi;

export { reportApi };
