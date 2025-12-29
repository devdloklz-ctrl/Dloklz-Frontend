import { PickupLocation } from "@/types/pickupLocation";
import api from "@/lib/axios";
import { Pencil, Trash2 } from "lucide-react";

interface PickupLocationCardProps {
  location: PickupLocation;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onUpdated?: () => void;
}

export default function PickupLocationCard({
  location,
  onView,
  onEdit,
  onDelete,
  onUpdated,
}: PickupLocationCardProps) {
  async function disableLocation() {
    if (!confirm("Disable this pickup location?")) return;
    await api.put(`/vendors/pickup-location/${location._id}`, {
      isActive: false,
    });
    onUpdated?.();
  }

  return (
    <div className="flex items-center justify-between p-4 border shadow-sm bg-surface rounded-xl">
      <div
        onClick={onView}
        className={onView ? "cursor-pointer" : undefined}
        role={onView ? "button" : undefined}
        tabIndex={onView ? 0 : undefined}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onView) onView();
        }}
      >
        <h3 className="font-semibold">{location.name}</h3>
        <p className="text-sm text-gray-500">
          {location.city} – {location.pincode}
        </p>
        <p className="text-sm">📞 {location.phone}</p>
      </div>

      <span
        className={`flex items-center h-6 px-4 text-xs rounded-full ${
          location.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
        }`}
      >
        {location.isActive ? "Active" : "Inactive"}
      </span>

      <div className="flex gap-2">
        {onEdit && (
          <button onClick={onEdit} className="p-2 border rounded hover:bg-gray-50" aria-label="Edit">
            <Pencil size={16} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => {
              if (confirm("Delete this pickup location?")) onDelete();
            }}
            className="p-2 text-red-600 border rounded hover:bg-red-50"
            aria-label="Delete"
          >
            <Trash2 size={16} />
          </button>
        )}
        <button
          onClick={disableLocation}
          className="p-2 text-orange-600 border rounded hover:bg-orange-50"
          aria-label="Disable"
          title="Disable pickup location"
        >
          Disable
        </button>
      </div>
    </div>
  );
}
