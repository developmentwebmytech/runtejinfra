"use client";

import React, { useEffect, useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Table, TableHeader, TableRow, TableHead,
  TableBody, TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogFooter, AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  topic: string;
  createdAt: string;
}

export default function GetContact() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null); // row id for dialog

  // fetch list once on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/contact", { cache: "no-store" });
        if (!res.ok) throw new Error("Fetch failed");
        const data: Contact[] = await res.json();
        setContacts(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // delete a row
  const deleteItem = async (id: string) => {
    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    if (res.ok) setContacts((prev) => prev.filter((c) => c._id !== id));
    setOpenId(null);
  };

  if (error) return <p className="p-4">Failed to load.</p>;
  if (loading) return <p className="p-4">Loading…</p>;

  return (
    <Card className="m-6">
      <CardHeader>
        <CardTitle>Contact Queries</CardTitle>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {contacts.map((q) => (
              <TableRow key={q._id}>
                <TableCell>{q.firstName} {q.lastName}</TableCell>
                <TableCell>{q.email}</TableCell>
                <TableCell>{q.topic}</TableCell>
                <TableCell>
                  {new Date(q.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setOpenId(q._id)}
                  >
                    Delete
                  </Button>

                  {/* confirmation dialog */}
                  <AlertDialog open={openId === q._id}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete this contact?
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpenId(null)}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteItem(q._id)}>
                          Yes, delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
