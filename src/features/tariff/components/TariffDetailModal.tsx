import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Tariff } from "@/types/api";
import { DollarSign, Calendar, MapPin, Zap, FileText, Percent } from "lucide-react";

interface TariffDetailModalProps {
  tariff: Tariff;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TariffDetailModal = ({
  tariff,
  open,
  onOpenChange,
}: TariffDetailModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{tariff.name}</DialogTitle>
            <Badge variant={tariff.isActive ? "default" : "secondary"}>
              {tariff.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          {tariff.description && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <h3 className="font-semibold">Description</h3>
              </div>
              <p className="text-sm text-gray-600">{tariff.description}</p>
            </div>
          )}

          <Separator />

          {/* Pricing Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold">Pricing Details</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-600">Price per kWh</div>
                <div className="text-2xl font-bold text-blue-900">
                  {tariff.pricePerKwh !== undefined
                    ? `${tariff.currency} ${tariff.pricePerKwh.toFixed(3)}`
                    : "Not set"}
                </div>
                <div className="text-xs text-blue-600 mt-1">Energy-based charging</div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-600">Price per Minute</div>
                <div className="text-2xl font-bold text-green-900">
                  {tariff.pricePerMinute !== undefined
                    ? `${tariff.currency} ${tariff.pricePerMinute.toFixed(3)}`
                    : "Not set"}
                </div>
                <div className="text-xs text-green-600 mt-1">Time-based charging</div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm font-medium text-purple-600">Price per Session</div>
                <div className="text-2xl font-bold text-purple-900">
                  {tariff.pricePerSession !== undefined
                    ? `${tariff.currency} ${tariff.pricePerSession.toFixed(2)}`
                    : "Not set"}
                </div>
                <div className="text-xs text-purple-600 mt-1">Fixed session fee</div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-sm font-medium text-yellow-600">Tax Rate</div>
                <div className="text-2xl font-bold text-yellow-900">
                  {tariff.taxRate !== undefined
                    ? `${(tariff.taxRate * 100).toFixed(1)}%`
                    : "0%"}
                </div>
                <div className="text-xs text-yellow-600 mt-1">Applied to total</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Validity Period */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold">Validity Period</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm font-medium text-gray-500">Valid From</div>
                <div className="text-lg font-semibold">
                  {new Date(tariff.validFrom).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Valid To</div>
                <div className="text-lg font-semibold">
                  {tariff.validTo
                    ? new Date(tariff.validTo).toLocaleString()
                    : "No end date"}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Scope Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold">Scope</h3>
            </div>
            <div className="space-y-3">
              {tariff.companyId && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Company ID</span>
                  <span className="text-sm text-gray-600">{tariff.companyId}</span>
                </div>
              )}
              {tariff.chargePointId && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Charge Point ID</span>
                  </div>
                  <span className="text-sm text-gray-600">{tariff.chargePointId}</span>
                </div>
              )}
              {tariff.connectorId !== undefined && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Connector ID</span>
                  <span className="text-sm text-gray-600">{tariff.connectorId}</span>
                </div>
              )}
              {!tariff.chargePointId && !tariff.connectorId && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Company-wide Tariff
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Applies to all charge points without specific tariffs
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div>
            <h3 className="font-semibold mb-4">Metadata</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Currency</span>
                <span className="text-sm text-gray-600">{tariff.currency}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Tariff ID</span>
                <span className="text-sm text-gray-600 font-mono">{tariff.id}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Created</span>
                <span className="text-sm text-gray-600">
                  {new Date(tariff.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Last Updated</span>
                <span className="text-sm text-gray-600">
                  {new Date(tariff.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Example */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-3 text-blue-900">Example Calculation</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">20 kWh charged</span>
                <span className="font-medium">
                  {tariff.pricePerKwh
                    ? `${tariff.currency} ${(20 * tariff.pricePerKwh).toFixed(2)}`
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">30 minutes</span>
                <span className="font-medium">
                  {tariff.pricePerMinute
                    ? `${tariff.currency} ${(30 * tariff.pricePerMinute).toFixed(2)}`
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Session fee</span>
                <span className="font-medium">
                  {tariff.pricePerSession
                    ? `${tariff.currency} ${tariff.pricePerSession.toFixed(2)}`
                    : "-"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-blue-900">
                <span>Subtotal</span>
                <span>
                  {tariff.currency}{" "}
                  {(
                    (tariff.pricePerKwh ? 20 * tariff.pricePerKwh : 0) +
                    (tariff.pricePerMinute ? 30 * tariff.pricePerMinute : 0) +
                    (tariff.pricePerSession ?? 0)
                  ).toFixed(2)}
                </span>
              </div>
              {tariff.taxRate && tariff.taxRate > 0 && (
                <>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax ({(tariff.taxRate * 100).toFixed(1)}%)</span>
                    <span>
                      {tariff.currency}{" "}
                      {(
                        ((tariff.pricePerKwh ? 20 * tariff.pricePerKwh : 0) +
                          (tariff.pricePerMinute ? 30 * tariff.pricePerMinute : 0) +
                          (tariff.pricePerSession ?? 0)) *
                        tariff.taxRate
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-blue-900">
                    <span>Total</span>
                    <span>
                      {tariff.currency}{" "}
                      {(
                        ((tariff.pricePerKwh ? 20 * tariff.pricePerKwh : 0) +
                          (tariff.pricePerMinute ? 30 * tariff.pricePerMinute : 0) +
                          (tariff.pricePerSession ?? 0)) *
                        (1 + tariff.taxRate)
                      ).toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
