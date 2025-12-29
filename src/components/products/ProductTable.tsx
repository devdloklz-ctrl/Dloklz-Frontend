// src/components/products/ProductTable.tsx
import React from "react";
import type { Product } from "@/types/product";
import Image from "next/image";

interface ProductTableProps {
  products: Product[];
  onView: (product: Product) => void;
}

export default function ProductTable({ products, onView }: ProductTableProps) {
  return (
    <div
      className="overflow-x-auto border rounded-lg"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-surface)",
      }}
    >
      <table className="min-w-full divide-y">
        <thead
          className="text-xs tracking-widest uppercase bg-border text-text-primary"
        >
          <tr className="border-b">
            <th className="w-12 px-4 py-3 text-left">
              #
            </th>
            <th className="w-20 px-4 py-3 text-left">
              Image
            </th>
            <th className="px-4 py-3 text-left">
              Name
            </th>
            <th className="px-4 py-3 text-left">
              Price
            </th>
            <th className="px-4 py-3 text-left">
              Stock
            </th>
            <th className="px-4 py-3 text-left w-28">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {products.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-6 text-center text-(--color-text-disabled)"
              >
                No products found.
              </td>
            </tr>
          )}

          {products.map((product, idx) => (
            <tr
              key={product.wooId}
              className="bg-surface"
            >
              <td className="px-4 py-4 whitespace-nowrap text-sm text-(--color-text-secondary)">
                {idx + 1}
              </td>

              <td className="px-4 py-4 whitespace-nowrap">
                {product.images?.[0]?.src ? (
                  <Image
                    src={product.images[0].src}
                    alt={product.images[0]?.alt || product.name}
                    className="object-cover w-12 h-12 rounded-md"
                    loading="lazy"
                    height={48}
                    width={48}
                  />
                ) : (
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-md text-[10px]"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text-disabled)",
                      border: `1px solid var(--color-border)`,
                    }}
                  >
                    No image
                  </div>
                )}
              </td>

              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-(--color-text-primary)">
                {product.name}
              </td>

              <td className="px-4 py-4 whitespace-nowrap text-sm text-(--color-text-secondary)">
                ₹{product.sale_price ?? product.price}
                {product.sale_price && (
                  <span
                    className="ml-2 line-through"
                    style={{ color: "var(--color-text-disabled)" }}
                  >
                    ₹{product.regular_price}
                  </span>
                )}
              </td>

              <td
                className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${(product.stock_quantity ?? 0) > 0 ? "text-green-600" : "text-red-600"
                  }`}
              >
                {(product.stock_quantity ?? 0) > 0
                  ? `In Stock (${product.stock_quantity})`
                  : "Out of Stock"}
              </td>

              <td className="px-4 py-4 text-sm whitespace-nowrap">
                <button
                  onClick={() => onView(product)}
                  className="text-sm font-medium transition cursor-pointer text-brand-primary hover:underline"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
