import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { transactionApi, usersApi } from "@/api";
import { isDemoMode } from "@/demo/demoMode";
import { useCompanyStore } from "@/store/company.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Search, Eye, Edit } from "lucide-react";
import { EditRFIDTagModal } from "./EditRFIDTagModal";

export const RFIDTagsList = () => {
  const companyId = useCompanyStore((s) => s.companyId);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all"
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<any>(null);

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAllUsers(),
  });

  const { data: sessionsResp, isLoading } = useQuery({
    queryKey: ["rfid-tags-sessions", companyId],
    queryFn: () => transactionApi.getSessionsByCompany(companyId ?? ""),
    enabled: isDemoMode || !!companyId,
  });

  const sessions = useMemo(() => (sessionsResp?.data ?? []) as any[], [sessionsResp]);

  const tags = useMemo(() => {
    const now = Date.now();
    const byTag: Record<
      string,
      {
        idTag: string;
        sessions: number;
        totalKwh: number;
        lastSeen?: string;
        lastChargePointId?: string;
        userId?: string;
        userName?: string;
      }
    > = {};

    for (const s of sessions) {
      const idTag = s.idTag ? String(s.idTag) : "";
      if (!idTag) continue;

      if (!byTag[idTag]) {
        byTag[idTag] = {
          idTag,
          sessions: 0,
          totalKwh: 0,
        };
      }

      byTag[idTag].sessions += 1;

      if (s.meterStop != null && s.meterStart != null) {
        byTag[idTag].totalKwh += (s.meterStop - s.meterStart) / 1000;
      }

      const ts = s.startTimestamp ? new Date(s.startTimestamp).getTime() : 0;
      const prev = byTag[idTag].lastSeen ? new Date(byTag[idTag].lastSeen!).getTime() : 0;
      if (ts >= prev) {
        byTag[idTag].lastSeen = s.startTimestamp;
        byTag[idTag].lastChargePointId = s.chargePointId;
        byTag[idTag].userId = s.userId;
        byTag[idTag].userName = s.userName;
      }
    }

    const list = Object.values(byTag);
    return list
      .map((t) => {
        const last = t.lastSeen ? new Date(t.lastSeen).getTime() : 0;
        const active = last > 0 && now - last <= 1000 * 60 * 60 * 24 * 30;
        return {
          ...t,
          status: active ? ("active" as const) : ("inactive" as const),
          user:
            t.userId && users
              ? users.find((u) => u.id === t.userId) ?? null
              : null,
        };
      })
      .sort((a, b) => {
        const ta = a.lastSeen ? new Date(a.lastSeen).getTime() : 0;
        const tb = b.lastSeen ? new Date(b.lastSeen).getTime() : 0;
        return tb - ta;
      });
  }, [sessions, users]);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return tags.filter((t) => {
      const matchesSearch =
        t.idTag.toLowerCase().includes(q) ||
        (t.user?.name?.toLowerCase().includes(q) ?? false) ||
        (t.user?.email?.toLowerCase().includes(q) ?? false) ||
        (t.lastChargePointId?.toLowerCase().includes(q) ?? false);

      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tags, searchTerm, statusFilter]);

  const handleEditTag = (tag: any) => {
    setSelectedTag(tag);
    setEditModalOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>RFID Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search tag, user, charger..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active (30d)</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading RFID tags...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No RFID tags found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Sessions</TableHead>
                <TableHead>Energy</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Last Charger</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.idTag}>
                  <TableCell className="font-mono text-sm">{t.idTag}</TableCell>
                  <TableCell>
                    {t.user ? (
                      <Link to={`/users/${t.user.id}`} className="text-primary hover:underline">
                        {t.user.name}
                      </Link>
                    ) : (
                      <span className="text-gray-500">Unassigned</span>
                    )}
                    {t.user?.email && (
                      <div className="text-xs text-gray-500">{t.user.email}</div>
                    )}
                  </TableCell>
                  <TableCell>{t.sessions}</TableCell>
                  <TableCell>{t.totalKwh.toFixed(2)} kWh</TableCell>
                  <TableCell>
                    {t.lastSeen ? new Date(t.lastSeen).toLocaleString() : "-"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {t.lastChargePointId ?? "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.status === "active" ? "default" : "secondary"}>
                      {t.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTag(t)}
                        title="Edit RFID Tag"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {t.user ? (
                        <Button asChild variant="ghost" size="sm" title="View User">
                          <Link to={`/users/${t.user.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" disabled>
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing {filtered.length} of {tags.length} tags
          </div>
        </div>
      </CardContent>

      <EditRFIDTagModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        tag={selectedTag}
        onSuccess={() => {
          setEditModalOpen(false);
          // Refetch data if needed
        }}
      />
    </Card>
  );
};

export default RFIDTagsList;
