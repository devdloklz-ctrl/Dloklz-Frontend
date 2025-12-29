"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Vendor } from "@/types/vendor";
import { Plus } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Card, CardContent } from "@/components/common/Card";
import { VendorTable } from "@/components/vendors/VendorTable";
import { VendorModal } from "@/components/vendors/VendorModal";
import { VendorRegisterModal } from "@/components/vendors/VendorRegisterModal";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Vendor | null>(null);
  const [mode, setMode] =
    useState<"view" | "edit" | "create" | "register" | null>(null);

  const loadVendors = async () => {
    setLoading(true);
    try {
      const res = await api.get("/vendors");
      setVendors(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const handleSaved = async () => {
    await loadVendors();
    setMode(null);
    setSelected(null);
  };

  async function deleteVendor(id: string) {
    if (!confirm("Delete this vendor?")) return;
    await api.delete(`/vendors/${id}`);
    setVendors((v) => v.filter((x) => x._id !== id));
  }

  return (
    <div className="px-8 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vendors</h1>
        <Button
          onClick={() => setMode("create")}
          className="flex gap-2 bg-brand-primary text-background"
        >
          <Plus size={16} /> Add Vendor
        </Button>
      </div>

      <Card>
        <CardContent>
          <VendorTable
            vendors={vendors}
            loading={loading}
            onView={(v) => {
              setSelected(v);
              setMode("view");
            }}
            onRegister={(v) => {
              setSelected(v);
              setMode("register");
            }}
            onDelete={deleteVendor}
          />
        </CardContent>
      </Card>

      {(mode === "view" || mode === "edit" || mode === "create") && (
        <VendorModal
          mode={mode}
          vendor={selected}
          onClose={() => setMode(null)}
          onSaved={handleSaved}
        />
      )}

      {mode === "register" && selected && (
        <VendorRegisterModal
          vendor={selected}
          onClose={() => setMode(null)}
          onRegistered={handleSaved}
        />
      )}
    </div>
  );
}
