import { PickupLocation } from "@/types/pickupLocation";
import PickupLocationCard from "./PickupLocationCard";

interface Props {
  locations: PickupLocation[];
  onView: (l: PickupLocation) => void;
  onEdit: (l: PickupLocation) => void;
  onDelete: (l: PickupLocation) => void;
}

export default function PickupLocationGrid({
  locations,
  onView,
  onEdit,
  onDelete,
}: Props) {
  if (!locations.length) {
    return (
      <div className="py-16 text-center text-gray-500">
        No pickup locations yet
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {locations.map((loc) => (
        <PickupLocationCard
          key={loc._id}
          location={loc}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
