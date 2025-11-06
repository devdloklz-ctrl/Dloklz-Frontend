"use client";

import React from "react";
import { Order } from "./hooks/useOrders";

interface OrderActionsProps {
  order: Order;
  onUpdateStatus: (orderId: number, status: string) => void;
}

export default function OrderActions({ order, onUpdateStatus }: OrderActionsProps) {
  const statuses = ["processing", "completed", "cancelled"];

  return (
    <div className="flex gap-2">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onUpdateStatus(order.orderId, status)}
          className={`px-3 py-1 rounded text-sm font-medium border transition ${
            order.status === status
              ? "bg-blue-600 text-white"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
