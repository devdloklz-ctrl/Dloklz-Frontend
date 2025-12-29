import { Vendor } from "@/types/vendor";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/common/Button";
import { UserPlus } from "lucide-react";

interface Props {
  vendors: Vendor[];
  loading: boolean;
  onView: (v: Vendor) => void;
  onRegister: (v: Vendor) => void;
  onDelete: (id: string) => void;
}

export function VendorTable({
  vendors,
  loading,
  onView,
  onRegister,
  onDelete,
}: Props) {
  return (
    <table className="w-full text-sm border-collapse">
      <thead className="bg-muted">
        <tr>
          <th className="p-4 font-semibold text-left border-b border-gray-300">Store</th>
          <th className="p-4 font-semibold text-left border-b border-gray-300">Phone</th>
          <th className="p-4 font-semibold text-left border-b border-gray-300">Status</th>
          <th className="p-4 font-semibold text-left border-b border-gray-300">Source</th>
          <th className="p-4 font-semibold text-right border-b border-gray-300">Actions</th>
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan={5} className="p-6 text-center text-gray-500">Loading…</td>
          </tr>
        ) : vendors.length === 0 ? (
          <tr>
            <td colSpan={5} className="p-6 text-center text-gray-500">No vendors</td>
          </tr>
        ) : (
          vendors.map((v) => (
            <tr
              key={v._id}
              className="border-b hover:bg-gray-50"
              style={{ verticalAlign: "middle" }}
            >
              <td className="p-4 font-medium text-left">{v.store_name || "—"}</td>
              <td className="p-4 text-left whitespace-nowrap">{v.phone ?? "—"}</td>
              <td className="p-4 text-left whitespace-nowrap">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    v.enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {v.enabled ? "Active" : "Disabled"}
                </span>
              </td>
              <td className="p-4 text-left whitespace-nowrap">
                {v.synced_from_woo ? "Woo" : "Manual"}
              </td>
              <td className="p-4 space-x-2 text-right">
                <Button
                  variant="ghost"
                  className="inline-flex items-center justify-center"
                  onClick={() => onView(v)}
                  aria-label={`View ${v.store_name}`}
                >
                  <Eye size={16} />
                </Button>
                {!v.user_id && (
                  <Button
                    variant="ghost"
                    className="inline-flex items-center justify-center"
                    onClick={() => onRegister(v)}
                    aria-label={`Register ${v.store_name}`}
                  >
                    <UserPlus size={16} />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="inline-flex items-center justify-center text-red-500"
                  onClick={() => onDelete(v._id)}
                  aria-label={`Delete ${v.store_name}`}
                >
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
