"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/* ────────── Interface mirrors the Mongo model ────────── */
interface JobApplication {
  _id: string;
  post: string;
  name: string;
  email: string;
  location: string;
  phone: string;
  qualifications?: string;
  company?: string;
  designation?: string;
  tenure?: string;
  reason?: string;
  status?: string;
  createdAt: string;
}

/* optional colour chip */
// const statusColor = (s = "pending") =>
//   ({
//     pending: "bg-yellow-100 text-yellow-800",
//     reviewed: "bg-blue-100 text-blue-800",
//     approved: "bg-green-100 text-green-800",
//     rejected: "bg-red-100 text-red-800",
//   }[s] || "bg-gray-100 text-gray-800");

export default function JobApplications() {
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<JobApplication | null>(null);

  /* fetch once */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/careers");
        setApps(await res.json());
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* view */
  const viewApp = async (id: string) => {
    const res = await fetch(`/api/careers/${id}`);
    setSelected(await res.json());
    setOpen(true);
  };

  /* delete */
  const deleteApp = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    const res = await fetch(`/api/careers/${id}`, { method: "DELETE" });
    if (res.ok) setApps((p) => p.filter((a) => a._id !== id));
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        Loading applications…
      </div>
    );

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Job Applications</h2>
          <p className="text-muted-foreground">
            Manage job applications from candidates
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Applications List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Post</TableHead>
                    <TableHead>Email / Phone</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Company</TableHead>
                    {/* <TableHead>Status</TableHead> */}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apps.map((a) => (
                    <TableRow key={a._id}>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell>{a.post}</TableCell>
                      <TableCell>
                        <div className="text-sm">{a.email}</div>
                        <div className="text-sm text-muted-foreground">
                          {a.phone}
                        </div>
                      </TableCell>
                      <TableCell>{a.location}</TableCell>
                      <TableCell>{a.company ?? "-"}</TableCell>
                      {/* <TableCell>
                        <Badge className={statusColor(a.status)}>
                          {a.status ?? "pending"}
                        </Badge>
                      </TableCell> */}
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewApp(a._id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => deleteApp(a._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              More info about the selected candidate
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span> {selected.name}
              </p>
              <p>
                <span className="font-medium">Post:</span> {selected.post}
              </p>
              <p>
                <span className="font-medium">Email:</span> {selected.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {selected.phone}
              </p>
              <p>
                <span className="font-medium">Location:</span>{" "}
                {selected.location}
              </p>
              <p>
                <span className="font-medium">Qualifications:</span>{" "}
                {selected.qualifications ?? "-"}
              </p>
              <p>
                <span className="font-medium">Company:</span>{" "}
                {selected.company ?? "-"}
              </p>
              <p>
                <span className="font-medium">Designation:</span>{" "}
                {selected.designation ?? "-"}
              </p>
              <p>
                <span className="font-medium">Tenure:</span>{" "}
                {selected.tenure ?? "-"}
              </p>
              <p>
                <span className="font-medium">Reason:</span>{" "}
                {selected.reason ?? "-"}
              </p>
              {/* <p>
                <span className="font-medium">Status:</span>{" "}
                {selected.status ?? "pending"}
              </p> */}
              <p>
                <span className="font-medium">Applied on:</span>{" "}
                {new Date(selected.createdAt).toLocaleString()}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
