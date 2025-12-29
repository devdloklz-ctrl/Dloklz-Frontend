import PickupLocationForm from "./PickupLocationForm";
import { PickupLocation } from "@/types/pickupLocation";

interface Props {
  open: boolean;
  mode: "add" | "edit" | "view";
  location?: PickupLocation;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PickupLocationModal({
  open,
  mode,
  location,
  onClose,
  onSuccess,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg p-6 bg-white rounded-xl">
        {mode === "view" ? (
          <div>
            <h2 className="mb-4 text-xl font-semibold">{location?.name}</h2>
            <div className="space-y-2 text-sm">
              <p><b>Address:</b> {location?.address}</p>
              <p><b>City:</b> {location?.city}</p>
              <p><b>State:</b> {location?.state}</p>
              <p><b>Pincode:</b> {location?.pincode}</p>
              <p><b>Phone:</b> {location?.phone}</p>
            </div>
            <div className="mt-6 text-right">
              <button onClick={onClose} className="btn-secondary">Close</button>
            </div>
          </div>
        ) : (
          <PickupLocationForm
            initialData={mode === "edit" ? location : undefined}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        )}
      </div>
    </div>
  );
}
