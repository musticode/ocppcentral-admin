import { Calendar, Eye, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Reservation, ReservationFilters } from "@/types/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateReservationModal } from "./CreateReservationModal";
import { ReservationDetail } from "./ReservationDetail";
import { reservationApi } from "@/api";
import { useToast } from "@/components/ui/use-toast";

const statusColors = {
  Active: "bg-green-500",
  Used: "bg-blue-500",
  Cancelled: "bg-gray-500",
  Expired: "bg-red-500",
};

export const ReservationList = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [filters, setFilters] = useState<ReservationFilters>({
    page: 1,
    limit: 20,
  });
  const [totalPages, setTotalPages] = useState(1);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const response = await reservationApi.getReservations(filters);
      setReservations(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch reservations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [filters]);

  const handleCancelReservation = async (reservationId: number) => {
    try {
      await reservationApi.cancelReservation(reservationId);
      toast({
        title: "Success",
        description: "Reservation cancelled successfully",
      });
      fetchReservations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel reservation",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setDetailModalOpen(true);
  };

  const handleStatusFilterChange = (value: string) => {
    setFilters({
      ...filters,
      status: value === "all" ? undefined : (value as ReservationFilters["status"]),
      page: 1,
    });
  };

  if (isLoading && reservations.length === 0) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Reservation
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Reservations</CardTitle>
            <div className="flex gap-4">
              <Select
                value={filters.status || "all"}
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Used">Used</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Charge Point</TableHead>
                <TableHead>Connector</TableHead>
                <TableHead>ID Tag</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No reservations found
                  </TableCell>
                </TableRow>
              ) : (
                reservations.map((reservation) => (
                  <TableRow key={reservation.reservationId}>
                    <TableCell className="font-mono text-sm">
                      {reservation.reservationId}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{reservation.chargePointName || reservation.chargePointId}</div>
                        {reservation.locationName && (
                          <div className="text-sm text-muted-foreground">{reservation.locationName}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{reservation.connectorId}</TableCell>
                    <TableCell className="font-mono text-sm">{reservation.idTag}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(reservation.expiryDate).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[reservation.status]}>
                        {reservation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(reservation.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(reservation)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {reservation.status === "Active" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelReservation(reservation.reservationId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {filters.page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.page === 1}
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.page === totalPages}
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateReservationModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={fetchReservations}
      />

      {selectedReservation && (
        <ReservationDetail
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          reservation={selectedReservation}
          onCancel={() => {
            handleCancelReservation(selectedReservation.reservationId);
            setDetailModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
