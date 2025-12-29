import { PickupLocation } from "@/types/pickupLocation";
import React from "react";

interface Props {
  location: PickupLocation;
  onEdit: () => void;
  onBack: () => void;
}

export default function PickupLocationView({ location, onEdit, onBack }: Props) {
  return (
    <div className="max-w-md p-4 border rounded bg-gray-50">
      <h2 className="mb-4 text-xl font-bold">View Pickup Location</h2>
      <p><strong>Name:</strong> {location.name}</p>
      <p><strong>Address:</strong> {location.address}</p>
      <p><strong>City:</strong> {location.city}</p>
      <p><strong>State:</strong> {location.state}</p>
      <p><strong>Pincode:</strong> {location.pincode}</p>
      <p><strong>Phone:</strong> {location.phone}</p>
      <p><strong>Active:</strong> {location.isActive ? "Yes" : "No"}</p>

      <div className="mt-4 space-x-2">
        <button
          onClick={onEdit}
          className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={onBack}
          className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500"
        >
          Back
        </button>
      </div>
    </div>
  );
}
