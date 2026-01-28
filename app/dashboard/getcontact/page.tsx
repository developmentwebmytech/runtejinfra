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
  const [openId, setOpenId] = useState<string | null>(null);

  // 🔹 pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const deleteItem = async (id: string) => {
    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    if (res.ok) {
      setContacts((prev) => prev.filter((c) => c._id !== id));
    }
    setOpenId(null);
  };

  if (error) return <p className="p-4">Failed to load.</p>;
  if (loading) return <p className="p-4">Loading…</p>;

  // 🔹 pagination logic
  const totalPages = Math.ceil(contacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContacts = contacts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
            {paginatedContacts.map((q) => (
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

        {/* 🔹 pagination UI */}
        {contacts.length > 10 && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </Button>

            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
