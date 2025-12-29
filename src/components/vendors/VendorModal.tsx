import { useState } from "react";
import api from "@/lib/axios";
import { Vendor, VendorForm } from "@/types/vendor";
import { Button } from "@/components/common/Button";
import { Card, CardContent } from "@/components/common/Card";

export function VendorModal({
  mode,
  vendor,
  onClose,
  onSaved,
}: {
  mode: "view" | "edit" | "create";
  vendor: Vendor | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<VendorForm>({
    store_name: vendor?.store_name ?? "",
    email: vendor?.email ?? "",
    enabled: vendor?.enabled ?? true,
  });

  function update<K extends keyof VendorForm>(key: K, value: VendorForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    if (mode === "create") {
      await api.post("/vendors", form);
    }
    if (mode === "edit" && vendor) {
      await api.put(`/vendors/${vendor._id}`, form);
    }
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold capitalize">
            {mode} vendor
          </h2>

          <input
            disabled={mode === "view"}
            value={form.store_name}
            onChange={(e) => update("store_name", e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Store name"
          />

          <input
            disabled={mode === "view"}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Email"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.enabled}
              disabled={mode === "view"}
              onChange={(e) => update("enabled", e.target.checked)}
            />
            Enabled
          </label>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            {mode !== "view" && (
              <Button onClick={save} className="bg-brand-primary text-background">Save</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
