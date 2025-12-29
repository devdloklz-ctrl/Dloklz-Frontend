const STEPS = [
  "pending",
  "manifested",
  "in_transit",
  "out_for_delivery",
  "delivered",
];

export default function ShipmentTimeline({ status }: { status: string }) {
  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="flex items-center justify-between mt-4">
      {STEPS.map((step, i) => {
        const isActive = i <= currentIndex;
        return (
          <div key={step} className="flex-1 text-center">
            <div
              className={`h-2 rounded-full mx-1 ${
                isActive ? "bg-green-500" : "bg-gray-200"
              }`}
            />
            <p className="mt-1 text-xs text-gray-600 capitalize">
              {step.replace("_", " ")}
            </p>
          </div>
        );
      })}
    </div>
  );
}
