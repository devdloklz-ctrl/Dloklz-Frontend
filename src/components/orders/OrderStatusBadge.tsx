export default function OrderStatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    pending: "bg-gray-100 text-gray-700",
    "on-hold": "bg-orange-100 text-orange-700",
    processing: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    refunded: "bg-purple-100 text-purple-700",

    // 🚚 Shipment statuses
    manifested: "bg-indigo-100 text-indigo-700",
    in_transit: "bg-blue-100 text-blue-700",
    out_for_delivery: "bg-sky-100 text-sky-700",
    delivered: "bg-green-100 text-green-700",
    rto: "bg-red-100 text-red-700",
    returned: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status.replace(/_/g, " ").toUpperCase()}
    </span>
  );
}
