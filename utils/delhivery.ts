// ✅ PUBLIC CUSTOMER TRACKING URL
export const getDelhiveryTrackingUrl = (waybill: string) => {
  return `https://www.delhivery.com/track/package/${waybill}`;
};
