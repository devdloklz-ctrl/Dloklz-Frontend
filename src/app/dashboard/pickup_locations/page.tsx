"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { PickupLocation } from "@/types/pickupLocation";
import PickupLocationCard from "@/components/vendors/pickup/PickupLocationCard";
import PickupLocationForm from "@/components/vendors/pickup/PickupLocationForm";
import { Plus } from "lucide-react";
import axios from "axios";

export default function PickupLocationsPage() {
  const [locations, setLocations] = useState<PickupLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PickupLocation | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchLocations() {
    setLoading(true);
    const res = await api.get("/vendors/pickup-location");
    setLocations(res.data.pickupLocations || []);
    setLoading(false);
  }

  useEffect(() => {
        async function fetchLocations() {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get("vendors/pickup-location");
                setLocations(response.data.pickupLocations || []);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.message || err.message);
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Failed to fetch pickup locations");
                }
            } finally {
                setLoading(false);
            }
        }
        fetchLocations();
    }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pickup Locations</h1>

        <button
          onClick={() => {
            setSelected(null);
            setOpenForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 text-white bg-black rounded-lg hover:opacity-90"
        >
          <Plus size={16} /> Add Pickup Location
        </button>
      </div>

      {/* List */}
      {loading ? (
        <p>Loading...</p>
      ) : locations.length === 0 ? (
        <p className="text-gray-500">No pickup locations yet</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {locations.map((loc) => (
            <PickupLocationCard
              key={loc._id}
              location={loc}
              onEdit={() => {
                setSelected(loc);
                setOpenForm(true);
              }}
              onUpdated={fetchLocations}
            />
          ))}
        </div>
      )}

      {/* Drawer / Modal */}
      {openForm && (
        <PickupLocationForm
          initialData={selected ?? undefined}
          onClose={() => setOpenForm(false)}
          onSuccess={() => {
            setOpenForm(false);
            fetchLocations();
          }}
        />
      )}
    </div>
  );
}
