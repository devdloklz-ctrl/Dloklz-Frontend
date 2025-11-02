"use client";
import { useState, useEffect } from "react";

interface OrderFilterProps {
  onFilter: (filters: {
    search?: string;
    status?: string;
    from?: string;
    to?: string;
  }) => void;
}

export default function OrderFilter({ onFilter }: OrderFilterProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 🔄 Whenever any filter changes, call backend filter
  useEffect(() => {
    const filters: {
      search?: string;
      status?: string;
      from?: string;
      to?: string;
    } = {};

    if (query.trim()) filters.search = query.trim();
    if (status && status !== "all") filters.status = status;
    if (startDate) filters.from = new Date(startDate).toISOString();
    if (endDate) {
      // End of day handling for better range filter
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filters.to = end.toISOString();
    }

    onFilter(filters);
  }, [query, status, startDate, endDate, onFilter]);

  const clearDates = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 flex-wrap">
      {/* 🔍 Search box */}
      <input
        type="search"
        placeholder="Search by name, email or order ID"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full sm:w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* ⚙️ Status dropdown */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="processing">In Progress</option>
        <option value="completed">Completed</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
        <option value="failed">Failed</option>
        <option value="refunded">Refunded</option>
      </select>

      {/* 📅 Date Range */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 mr-1">From</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        />
        <label className="text-sm text-gray-600 ml-2 mr-1">To</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        />
        {(startDate || endDate) && (
          <button
            onClick={clearDates}
            className="ml-3 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm hover:bg-gray-200"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
