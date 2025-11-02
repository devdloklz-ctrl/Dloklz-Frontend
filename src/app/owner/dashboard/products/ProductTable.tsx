"use client";

import React from "react";
import { Product } from "./hooks/useProducts";
import Image from "next/image";

interface Props {
    products: Product[];
    onView: (p: Product) => void;
}

export default function ProductTable({ products, onView }: Props) {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-y-auto max-h-[75vh]">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 border-b text-gray-600 uppercase text-xs tracking-wide sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3">Product</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Stock</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((p, idx) => (
                            <tr
                                key={p._id}
                                className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    } hover:bg-blue-50/40 transition-all border-b border-gray-100`}
                            >
                                {/* Product Info */}
                                <td className="px-6 py-3 flex items-center gap-3">
                                    <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center border border-gray-200">
                                        <Image
                                            src={p.images?.[0]?.src || "/placeholder.png"}
                                            alt={p.name || "product"}
                                            width={56}
                                            height={56}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src =
                                                    "/placeholder.png";
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 line-clamp-1">
                                            {p.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {p.sku ? `SKU: ${p.sku}` : ""}
                                        </p>
                                    </div>
                                </td>

                                {/* Price */}
                                <td className="px-6 py-3 text-gray-800 font-semibold">
                                    ₹{p.price || p.regular_price || "—"}
                                    {p.on_sale && (
                                        <p className="text-xs text-green-600 mt-0.5 font-medium">
                                            On sale
                                        </p>
                                    )}
                                </td>

                                {/* Stock */}
                                <td className="px-6 py-3 text-gray-700">
                                    <p
                                        className={`font-medium ${p.stock_status === "instock"
                                                ? "text-green-700"
                                                : "text-red-700"
                                            }`}
                                    >
                                        {p.stock_status === "instock"
                                            ? "In stock"
                                            : "Out of stock"}
                                    </p>
                                    {typeof p.stock_quantity === "number" && (
                                        <p className="text-xs text-gray-500">
                                            Qty: {p.stock_quantity}
                                        </p>
                                    )}
                                </td>

                                {/* Status */}
                                <td className="px-6 py-3 text-center">
                                    <span
                                        className={`px-3 py-1 text-xs font-medium rounded-full border ${p.status === "publish"
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                            }`}
                                    >
                                        {p.status || "—"}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-3 text-center">
                                    <button
                                        onClick={() => onView(p)}
                                        className="px-3 py-1 text-xs font-medium rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 transition-all"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {products.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-8 text-center text-gray-500 text-sm"
                                >
                                    No products available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
