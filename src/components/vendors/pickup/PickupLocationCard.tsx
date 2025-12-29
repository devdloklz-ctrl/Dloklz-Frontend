import { PickupLocation } from "@/types/pickupLocation";
import api from "@/lib/axios";
import { Pencil, Trash2 } from "lucide-react";

export default function PickupLocationCard({
  location,
  onEdit,
  onUpdated,
}: {
  location: PickupLocation;
  onEdit: () => void;
  onUpdated: () => void;
}) {
  async function disableLocation() {
    if (!confirm("Disable this pickup location?")) return;
    await api.put(`/vendors/pickup-location/${location._id}`, {
      isActive: false,
    });
    onUpdated();
  }

  return (
    <div className="flex items-center justify-between p-4 border shadow-sm bg-surface rounded-xl">
      <div>
        <h3 className="font-semibold">{location.name}</h3>
        <p className="text-sm text-gray-500">
          {location.city} – {location.pincode}
        </p>
        <p className="text-sm">📞 {location.phone}</p>
      </div>

      <span
        className={`flex items-center h-6 px-4 text-xs rounded-full ${location.isActive
            ? "bg-green-100 text-green-700"
            : "bg-gray-200 text-gray-600"
          }`}
      >
        {location.isActive ? "Active" : "Inactive"}
      </span>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="p-2 border rounded hover:bg-gray-50"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={disableLocation}
          className="p-2 text-red-600 border rounded hover:bg-red-50"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
