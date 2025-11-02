"use client";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

interface Props {
  onView: () => void;
  onUpdate: () => void;
}

export default function OrderActions({ onView, onUpdate }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 hover:bg-gray-200 rounded-full"
      >
        <BsThreeDotsVertical />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white shadow-md rounded-lg border border-gray-100 z-50">
          <button
            onClick={() => {
              onView();
              setOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50"
          >
            View Order
          </button>
          <button
            onClick={() => {
              onUpdate();
              setOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50"
          >
            Update Order
          </button>
        </div>
      )}
    </div>
  );
}
