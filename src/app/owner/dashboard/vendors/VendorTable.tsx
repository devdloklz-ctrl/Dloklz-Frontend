"use client";

import { Vendor } from "./hooks/useVendors";
import Image from "next/image";

interface Props {
  vendors: Vendor[];
  onView: (v: Vendor) => void;
  onDelete: (id: number) => void;
}

export default function VendorTable({ vendors, onView, onDelete }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="overflow-y-auto max-h-[85vh]">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 border-b text-gray-600 uppercase text-xs tracking-wide sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3">Vendor</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Rating</th>
              <th className="px-6 py-3">Registered</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {vendors.map((v, idx) => (
              <tr
                key={v._id}
                className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50/40 transition-all border-b border-gray-100`}
              >
                <td className="px-6 py-3 flex items-center gap-3">
                  <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    <Image
                      src={v.banner || "/placeholder.png"}
                      alt={v.store_name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{v.store_name}</p>
                    <p className="text-xs text-gray-500">
                      {v.first_name} {v.last_name}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-3">{v.phone || "-"}</td>

                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${
                      v.enabled
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {v.enabled ? "Enabled" : "Disabled"}
                  </span>
                </td>

                <td className="px-6 py-3">
                  {v.rating?.rating || "No ratings"}
                </td>

                <td className="px-6 py-3 text-gray-600 text-sm">
                  {v.registered
                    ? new Date(v.registered).toLocaleDateString("en-IN", {
                        dateStyle: "medium",
                      })
                    : "-"}
                </td>

                <td className="px-6 py-3 text-center space-x-2">
                  <button
                    onClick={() => onView(v)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onDelete(v.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {vendors.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No vendors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
