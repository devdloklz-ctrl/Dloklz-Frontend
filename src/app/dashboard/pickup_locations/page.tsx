"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { PickupLocation } from "@/types/pickupLocation";
import PickupLocationGrid from "@/components/vendors/pickup/PickupLocationGrid";
import PickupLocationModal from "@/components/vendors/pickup/PickupLocationModal";
import { Plus } from "lucide-react";

export default function PickupLocationsPage() {
  const [locations, setLocations] = useState<PickupLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PickupLocation | null>(null);
  const [mode, setMode] = useState<"add" | "edit" | "view">("add");
  const [openModal, setOpenModal] = useState(false);

  async function fetchLocations() {
    setLoading(true);
    try {
      const res = await api.get("/vendors/pickup-location");
      setLocations(res.data.pickupLocations || []);
    } catch (err) {
      // handle error if needed
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pickup Locations</h1>

        <button
          onClick={() => {
            setSelected(null);
            setMode("add");
            setOpenModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 text-white bg-black rounded-lg hover:opacity-90"
        >
          <Plus size={16} /> Add Pickup Location
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <PickupLocationGrid
          locations={locations}
          onView={(loc) => {
            setSelected(loc);
            setMode("view");
            setOpenModal(true);
          }}
          onEdit={(loc) => {
            setSelected(loc);
            setMode("edit");
            setOpenModal(true);
          }}
          onDelete={async (loc) => {
            if (!confirm("Are you sure you want to delete this pickup location?")) return;
            await api.delete(`/vendors/pickup-location/${loc._id}`);
            fetchLocations();
          }}
          onUpdated={fetchLocations}
        />
      )}

      <PickupLocationModal
        open={openModal}
        mode={mode}
        location={selected ?? undefined}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          fetchLocations();
        }}
      />
    </div>
  );
}
