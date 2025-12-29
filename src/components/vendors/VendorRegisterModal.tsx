"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { Vendor } from "@/types/vendor";
import { Button } from "@/components/common/Button";

interface Props {
  vendor: Vendor;
  onClose: () => void;
  onRegistered: () => void;
}

export function VendorRegisterModal({
  vendor,
  onClose,
  onRegistered,
}: Props) {
  const [phone, setPhone] = useState(vendor.phone ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function register() {
    if (!phone) {
      alert("Phone number is required");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        username: vendor.store_name,
        identifier: phone,
        password,
        roles: ["vendor"],
        vendorId: vendor.id,
      });

      onRegistered();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to register vendor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 p-6 space-y-4 shadow-xl w-120 rounded-2xl bg-background">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Register Vendor</h2>
          <p className="text-sm text-muted-foreground">
            Create login access for this vendor
          </p>
        </div>

        <div className="border-t" />

        {/* Vendor Info */}
        <div className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Store:</span>{" "}
            <strong>{vendor.store_name}</strong>
          </p>
          {vendor.first_name && (
            <p>
              <span className="text-muted-foreground">Owner:</span>{" "}
              {vendor.first_name} {vendor.last_name}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Phone Number</label>
          <input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-brand-primary"
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="Set password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-brand-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={register}
            disabled={loading || !phone || !password}
            className="bg-brand-primary text-background"
          >
            {loading ? "Registering…" : "Register"}
          </Button>
        </div>
      </div>
    </div>
  );
}
