export type WizardStep =
  | "brand-model"
  | "site-location"
  | "charger-name"
  | "charger-added"
  | "ocpp-integration"
  | "ocpp-url-config"
  | "connection-failed"
  | "connection-success";

export interface ChargerWizardData {
  // Step 1 – Brand & Model
  vendor: string;
  model: string;
  maxPowerKw: string;
  connectorType: string;
  // Step 2 – Site / Location
  siteOption: "new" | "existing" | "none";
  locationId: string;
  newSiteName: string;
  newSiteAddress: string;
  // Step 3 – Charger Name
  name: string;
  chargerAccess: string;
  isActive: boolean;
  showOnMap: boolean;
  // Step 5 – OCPP Integration
  chargePointId: string;
  // General
  ocppVersion: string;
  connectorCount: string;
}

export const defaultWizardData: ChargerWizardData = {
  vendor: "",
  model: "",
  maxPowerKw: "",
  connectorType: "",
  siteOption: "existing",
  locationId: "",
  newSiteName: "",
  newSiteAddress: "",
  name: "",
  chargerAccess: "",
  isActive: false,
  showOnMap: false,
  chargePointId: "",
  ocppVersion: "1.6",
  connectorCount: "1",
};

export const CHARGER_BRANDS = [
  { vendor: "ABB", models: ["EVLunic Basic", "EVLunic Pro", "Terra AC"] },
  { vendor: "ChargePoint", models: ["CT4000", "CPF50", "CP6000"] },
  { vendor: "Schneider Electric", models: ["EVlink City", "EVlink Parking", "EVlink Smart Wallbox"] },
  { vendor: "Siemens", models: ["VersiCharge", "VersiCharge Gen 3"] },
  { vendor: "Wallbox", models: ["Pulsar Plus", "Copper SB", "Commander 2"] },
  { vendor: "Easee", models: ["Easee Home", "Easee Charge"] },
  { vendor: "Other", models: ["Other"] },
];

export const CONNECTOR_TYPES = [
  "Type 1",
  "Type 2",
  "CCS",
  "CHAdeMO",
  "Tesla",
  "Other",
];
