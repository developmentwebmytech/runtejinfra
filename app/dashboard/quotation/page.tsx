"use client";
import React, { useEffect, useState } from "react";
import {
  Table, TableHeader, TableBody, TableRow,
  TableHead, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// 🆕  icons
import { Eye, Trash2 } from "lucide-react";   // eye‑for‑view, trash‑for‑delete

interface Quotation {
  _id: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  projectType: string;
  pinCode: string;
  budget: string;
}

export default function QuotationPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [selected, setSelected] = useState<Quotation | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  // Load data
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/quotation");
      setQuotations(await res.json());
    })();
  }, []);

  // Delete (pass id in the URL)
  async function handleDelete(id: string) {
    const res = await fetch(`/api/quotation/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Quotation deleted");
      setSelected(null);
      // refresh list
      const fresh = await fetch("/api/quotation");
      setQuotations(await fresh.json());
    } else {
      toast.error("Failed to delete");
    }
  }

  const totalPages = Math.ceil(quotations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuotations = quotations.slice(
    startIndex,
    startIndex + itemsPerPage
  );


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quotation List</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Project</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedQuotations.map((q) => (

            <TableRow key={q._id}>
              <TableCell>{q.title} {q.firstName} {q.lastName}</TableCell>
              <TableCell>{q.email}</TableCell>
              <TableCell>{q.projectType}</TableCell>

              <TableCell className="flex gap-2 justify-center">
                {/* ---------- View dialog ---------- */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelected(q)}
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Quotation Details</DialogTitle>
                    </DialogHeader>

                    {selected && (
                      <div className="text-sm space-y-2">
                        <p><strong>Name:</strong> {selected.title} {selected.firstName} {selected.lastName}</p>
                        <p><strong>Email:</strong> {selected.email}</p>
                        <p><strong>Phone:</strong> {selected.phone}</p>
                        <p><strong>Project:</strong> {selected.projectType}</p>
                        <p><strong>Pin Code:</strong> {selected.pinCode}</p>
                        <p><strong>Budget:</strong> {selected.budget}</p>
                      </div>
                    )}

                    <DialogFooter className="mt-4">
                      <Button
                        variant="destructive"
                        onClick={() => selected && handleDelete(selected._id)}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* ---------- Quick delete without opening dialog (optional) ---------- */}
                <Button
                  variant="destructive"
                  size="icon"
                  title="Delete"
                  onClick={() => handleDelete(q._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center items-center gap-3 mt-6">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </Button>

        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

    </div>
  );
}
