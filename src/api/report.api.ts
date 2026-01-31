import { apiClient } from "./axios";

export type ReportPeriod = "1W" | "1M" | "3M" | "1Y" | "ALL";

export interface ReportStats {
  totalEnergyKwh: number;
  totalSessions: number;
  totalRevenue: number;
  avgSessionDuration: number;
  activeSessions: number;
  peakPowerKw: number;
}

export interface EnergyConsumptionDataPoint {
  date: string;
  energyKwh: number;
  sessions: number;
}

export interface UsageDataPoint {
  period: string;
  sessions: number;
  energyKwh: number;
  revenue: number;
}

export interface ConsumptionByLocation {
  locationId: string;
  locationName: string;
  energyKwh: number;
  sessions: number;
  percentage: number;
}

export interface HourlyUsageDataPoint {
  hour: string;
  energyKwh: number;
  sessions: number;
}

export const reportApi = {
  getReportStats: async (
    period: ReportPeriod,
    locationId?: string,
  ): Promise<ReportStats> => {
    try {
      const params: Record<string, string> = { period };
      if (locationId) params.locationId = locationId;
      const response = await apiClient.get<ReportStats>("/reports/stats", {
        params,
      });
      return response.data;
    } catch {
      // Fallback to mock data when endpoint not available
      return getMockReportStats(period);
    }
  },

  getEnergyConsumption: async (
    period: ReportPeriod,
    locationId?: string,
  ): Promise<EnergyConsumptionDataPoint[]> => {
    try {
      const params: Record<string, string> = { period };
      if (locationId) params.locationId = locationId;
      const response = await apiClient.get<EnergyConsumptionDataPoint[]>(
        "/reports/energy-consumption",
        { params },
      );
      return response.data;
    } catch {
      return getMockEnergyData(period);
    }
  },

  getUsageByPeriod: async (
    period: ReportPeriod,
    locationId?: string,
  ): Promise<UsageDataPoint[]> => {
    try {
      const params: Record<string, string> = { period };
      if (locationId) params.locationId = locationId;
      const response = await apiClient.get<UsageDataPoint[]>("/reports/usage", {
        params,
      });
      return response.data;
    } catch {
      return getMockUsageData(period);
    }
  },

  getConsumptionByLocation: async (
    period: ReportPeriod,
  ): Promise<ConsumptionByLocation[]> => {
    try {
      const response = await apiClient.get<ConsumptionByLocation[]>(
        "/reports/consumption-by-location",
        { params: { period } },
      );
      return response.data;
    } catch {
      return getMockConsumptionByLocation();
    }
  },

  getHourlyUsage: async (
    period: ReportPeriod,
    locationId?: string,
  ): Promise<HourlyUsageDataPoint[]> => {
    try {
      const params: Record<string, string> = { period };
      if (locationId) params.locationId = locationId;
      const response = await apiClient.get<HourlyUsageDataPoint[]>(
        "/reports/hourly-usage",
        { params },
      );
      return response.data;
    } catch {
      return getMockHourlyUsage();
    }
  },
};

// Mock data generators for when API is not available
function getMockReportStats(_period: ReportPeriod): ReportStats {
  return {
    totalEnergyKwh: 12450,
    totalSessions: 892,
    totalRevenue: 6234,
    avgSessionDuration: 42,
    activeSessions: 12,
    peakPowerKw: 350,
  };
}

function getMockEnergyData(period: ReportPeriod): EnergyConsumptionDataPoint[] {
  const points =
    period === "1W"
      ? 7
      : period === "1M"
        ? 30
        : period === "3M"
          ? 12
          : period === "1Y"
            ? 12
            : 12;
  const labels =
    period === "1W"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : period === "1M"
        ? Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
        : [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ].slice(0, points);

  return labels.map((date, i) => ({
    date,
    energyKwh: Math.round(800 + Math.random() * 600 + i * 50),
    sessions: Math.round(20 + Math.random() * 40 + i * 2),
  }));
}

function getMockUsageData(period: ReportPeriod): UsageDataPoint[] {
  const labels =
    period === "1W"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ].slice(
          0,
          period === "1M" ? 4 : period === "3M" ? 3 : period === "1Y" ? 12 : 12,
        );

  return labels.map((period_label, i) => ({
    period: period_label,
    sessions: Math.round(50 + Math.random() * 80 + i * 15),
    energyKwh: Math.round(600 + Math.random() * 900 + i * 100),
    revenue: Math.round(400 + Math.random() * 600 + i * 80),
  }));
}

function getMockConsumptionByLocation(): ConsumptionByLocation[] {
  const total = 12450;
  const data = [
    { locationName: "Downtown Station", energyKwh: 4520, sessions: 320 },
    { locationName: "Airport Hub", energyKwh: 3890, sessions: 245 },
    { locationName: "Shopping Mall", energyKwh: 2340, sessions: 198 },
    { locationName: "Highway Rest", energyKwh: 1200, sessions: 89 },
    { locationName: "Corporate Park", energyKwh: 500, sessions: 40 },
  ];

  return data.map((d, i) => ({
    locationId: String(i + 1),
    locationName: d.locationName,
    energyKwh: d.energyKwh,
    sessions: d.sessions,
    percentage: Math.round((d.energyKwh / total) * 100),
  }));
}

function getMockHourlyUsage(): HourlyUsageDataPoint[] {
  const hours = [
    "12am",
    "1am",
    "2am",
    "3am",
    "4am",
    "5am",
    "6am",
    "7am",
    "8am",
    "9am",
    "10am",
    "11am",
    "12pm",
    "1pm",
    "2pm",
    "3pm",
    "4pm",
    "5pm",
    "6pm",
    "7pm",
    "8pm",
    "9pm",
    "10pm",
    "11pm",
  ];
  return hours.map((hour, i) => ({
    hour,
    energyKwh:
      i >= 6 && i <= 22
        ? Math.round(80 + Math.random() * 120 + (i - 14) ** 2 * -0.5)
        : Math.round(20 + Math.random() * 30),
    sessions:
      i >= 7 && i <= 21
        ? Math.round(5 + Math.random() * 15)
        : Math.round(1 + Math.random() * 3),
  }));
}
