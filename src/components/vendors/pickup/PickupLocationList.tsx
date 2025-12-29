import { PickupLocation } from "@/types/pickupLocation";
import React from "react";

interface Props {
  locations: PickupLocation[];
  loading: boolean;
  error: string | null;
  onView: (location: PickupLocation) => void;
  onEdit: (location: PickupLocation) => void;
  onDelete: (location: PickupLocation) => void;
}

export default function PickupLocationList({
  locations,
  loading,
  error,
  onView,
  onEdit,
  onDelete,
}: Props) {
  if (loading) return <p>Loading pickup locations...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (locations.length === 0) return <p>No pickup locations found.</p>;

  return (
    <table className="w-full border border-collapse border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border border-gray-300">Name</th>
          <th className="p-2 border border-gray-300">City</th>
          <th className="p-2 border border-gray-300">Pincode</th>
          <th className="p-2 border border-gray-300">Phone</th>
          <th className="p-2 border border-gray-300">Active</th>
          <th className="p-2 border border-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody>
        {locations.map((loc) => (
          <tr key={loc._id}>
            <td className="p-2 border border-gray-300">{loc.name}</td>
            <td className="p-2 border border-gray-300">{loc.city}</td>
            <td className="p-2 border border-gray-300">{loc.pincode}</td>
            <td className="p-2 border border-gray-300">{loc.phone}</td>
            <td className="p-2 border border-gray-300">{loc.isActive ? "Yes" : "No"}</td>
            <td className="p-2 space-x-2 border border-gray-300">
              <button
                onClick={() => onView(loc)}
                className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                View
              </button>
              <button
                onClick={() => onEdit(loc)}
                className="px-2 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(loc)}
                className="px-2 py-1 text-white bg-red-600 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
