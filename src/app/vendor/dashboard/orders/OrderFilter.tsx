"use client";

import React from "react";

interface OrderFilterProps {
  filter: string;
  setFilter: (filter: string) => void;
}

export default function OrderFilter({ filter, setFilter }: OrderFilterProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <label className="text-gray-600 font-medium">Filter by status:</label>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-1.5 text-gray-700"
      >
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="completed">Completed</option>
        <option value="failed">Failed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  );
}
