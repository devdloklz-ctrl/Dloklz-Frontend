"use client";
import { useState } from "react";
import { useVendors, Vendor } from "./hooks/useVendors";
import VendorTable from "./VendorTable";
import VendorDetailsModal from "./VendorDetailsModal";

export default function VendorsPage() {
  const { vendors, loading, deleteVendor, updateVendor } = useVendors();
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">All Vendors</h1>

      {loading ? (
        <div className="text-gray-500">Loading vendors...</div>
      ) : (
        <VendorTable
          vendors={vendors}
          onView={(v) => setSelectedVendor(v)}
          onDelete={deleteVendor}
        />
      )}

      {selectedVendor && (
        <VendorDetailsModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onUpdate={updateVendor}
        />
      )}
    </div>
  );
}
