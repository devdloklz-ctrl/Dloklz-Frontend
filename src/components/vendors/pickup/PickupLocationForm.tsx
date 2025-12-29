"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { PickupLocation } from "@/types/pickupLocation";
import { useToast } from "@/components/common/ui/Toast";

/**
 * Only editable fields
 */
type FormState = Pick<
    PickupLocation,
    "name" | "address" | "city" | "state" | "pincode" | "phone" | "email"
>;

const FIELDS: { key: keyof FormState; label: string; type?: string }[] = [
    { key: "name", label: "Location Name (Don't use spaces in between use '_')" },
    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "pincode", label: "Pincode" },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "email", label: "Email", type: "email" },
];


interface PickupLocationFormProps {
    initialData?: PickupLocation;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PickupLocationForm({
    initialData,
    onClose,
    onSuccess,
}: PickupLocationFormProps) {
    const [form, setForm] = useState<FormState>({
        name: initialData?.name ?? "",
        address: initialData?.address ?? "",
        city: initialData?.city ?? "",
        state: initialData?.state ?? "",
        pincode: initialData?.pincode ?? "",
        phone: initialData?.phone ?? "",
        email: initialData?.email ?? "",
    });

    const { showToast } = useToast();
    const [saving, setSaving] = useState(false);

    async function handleSubmit() {
        setSaving(true);
        try {
            if (initialData?._id) {
                await api.put(`/vendors/pickup-location/${initialData._id}`, form);
                showToast("Pickup location updated successfully");
            } else {
                await api.post("/vendors/pickup-location", form);
                showToast("Pickup location created successfully");
            }
            onSuccess();
        } catch {
            showToast("An error occurred. Please try again.");
        }finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
            <div className="w-full max-w-md p-6 shadow-xl bg-background">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">
                        {initialData ? "Edit Pickup Location" : "Add Pickup Location"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {FIELDS.map(({ key, label, type }) => (
                        <div key={key}>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                {label} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type={type ?? "text"}
                                value={form[key]}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                                }
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex justify-between gap-4 mt-6">
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="w-full px-4 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="w-full px-4 py-2 text-white bg-black rounded-lg disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
