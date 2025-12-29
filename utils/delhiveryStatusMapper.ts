export const mapDelhiveryStatusToTimeline = (status = "") => {
  const s = status.toLowerCase();

  if (s.includes("manifest")) return "manifested";
  if (s.includes("in transit")) return "in_transit";
  if (s.includes("out for delivery")) return "out_for_delivery";
  if (s.includes("delivered")) return "delivered";
  if (s.includes("rto")) return "rto";
  if (s.includes("cancel")) return "cancelled";

  return "pending";
};
