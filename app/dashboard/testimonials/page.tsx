"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Edit } from "lucide-react";

interface Testimonial {
  _id: string;
  name: string;
  quote: string;
}

export default function TestimonialsPage() {
  const [list, setList] = useState<Testimonial[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", quote: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  /* load */
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/testimonials");
      setList(await res.json());
    })();
  }, []);

  const openNew = () => {
    setForm({ name: "", quote: "" });
    setEditingId(null);
    setOpen(true);
  };

  const save = async () => {
    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId
        ? `/api/testimonials/${editingId}`
        : "/api/testimonials";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const isJson = res.headers
        .get("content-type")
        ?.includes("application/json");

      const data = isJson ? await res.json() : await res.text();

      if (!res.ok) {
        alert(`Error ${res.status}. Check console for details.`);
        return;
      }

      if (editingId) {
        setList((l) => l.map((t) => (t._id === editingId ? data : t)));
      } else {
        setList((l) => [data, ...l]);
      }
      setOpen(false);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed — see console.");
    }
  };

  const edit = (t: Testimonial) => {
    setForm({ name: t.name, quote: t.quote });
    setEditingId(t._id);
    setOpen(true);
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    if (res.ok) setList((l) => l.filter((t) => t._id !== id));
  };

  const totalPages = Math.ceil(list.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = list.slice(
    startIndex,
    startIndex + itemsPerPage
  );


  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Button onClick={openNew}>
          {list.length === 0 ? "Add First Testimonial" : "Add New"}
        </Button>
      </div>

      {list.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-muted-foreground">No testimonials found.</p>
            <Button onClick={openNew}>Add First Testimonial</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Quote</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedList.map((t) => (

                  <TableRow key={t._id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {t.quote}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => edit(t)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => del(t._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {list.length > 10 && (
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


      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Add"} Testimonial</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Quote</Label>
              <Input
                value={form.quote}
                onChange={(e) =>
                  setForm({ ...form, quote: e.target.value })
                }
              />
            </div>
            <Button onClick={save} className="w-full">
              {editingId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
