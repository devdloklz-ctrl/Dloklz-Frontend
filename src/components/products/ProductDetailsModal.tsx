"use client";

import React from "react";
import Image from "next/image";
import type { Product } from "@/types/product";

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, onClose }: Props) {
  if (!product) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return null;
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-auto"
      >
        <div className="relative grid w-full grid-cols-1 gap-8 p-8 bg-background max-w-7xl rounded-3xl md:grid-cols-3">
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close product details"
            className="absolute text-4xl font-light text-gray-500 transition top-6 right-6 hover:text-gray-900"
          >
            &times;
          </button>

          {/* Image Box */}
          <div className="border-border rounded-xl">
            {product.images && product.images.length > 0 ? (
              <div className="relative w-full aspect-4/5">
                <Image
                  src={product.images[0].src}
                  alt={product.images[0].alt || product.name}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-full text-xl font-semibold text-gray-400 bg-gray-100 h-80">
                No Image Available
              </div>
            )}
          </div>

          {/* Main Info Box: Name, Price, Stock, SKU */}
          <div className="p-6 space-y-6 border border-border rounded-xl">
            <h2
              id="product-title"
              className="text-3xl font-bold text-gray-900 font-playfair"
            >
              {product.name}
            </h2>

            {/* Price & Sale */}
            <div className="flex items-center gap-4">
              {product.on_sale ? (
                <>
                  <span className="text-2xl font-extrabold text-red-600">
                    ₹{product.sale_price ?? product.price}
                  </span>
                  <span className="text-gray-400 line-through">
                    ₹{product.regular_price}
                  </span>
                  <span className="px-3 py-1 ml-auto text-xs font-semibold tracking-wide text-red-600 uppercase bg-red-100 rounded-full">
                    Sale
                  </span>
                </>
              ) : (
                <span className="text-2xl font-extrabold text-gray-900">
                  ₹{product.price ?? product.regular_price ?? "N/A"}
                </span>
              )}
            </div>

            {/* Stock & SKU */}
            <div className="text-gray-700">
              <p className="mb-1">
                <strong>Stock Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    product.stock_status === "instock"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {product.stock_status ?? "Unavailable"}
                </span>
              </p>
              {typeof product.stock_quantity === "number" && (
                <p>
                  <strong>Quantity Available:</strong> {product.stock_quantity}
                </p>
              )}
              {product.sku && (
                <p>
                  <strong>SKU:</strong> {product.sku}
                </p>
              )}
            </div>
          </div>

          {/* Description Box */}
          <div className="p-6 overflow-y-auto prose text-gray-800 border border-border rounded-xl max-w-none max-h-64">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 font-playfair">
              Description
            </h3>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  product.short_description ||
                  product.description ||
                  "<i>No description available.</i>",
              }}
            />
          </div>

          {/* Categories & Tags Box */}
          <div className="p-6 space-y-3 text-gray-700 border border-border rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 font-playfair">
              Categories & Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {(product.categories?.length ?? 0) === 0 &&
              (product.tags?.length ?? 0) === 0 ? (
                <p className="italic text-gray-400">No categories or tags.</p>
              ) : (
                <>
                  {product.categories?.map((c) => (
                    <span
                      key={c.id}
                      className="inline-block px-4 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-full"
                    >
                      {c.name}
                    </span>
                  ))}
                  {product.tags?.map((t) => (
                    <span
                      key={t.id}
                      className="inline-block px-4 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-full"
                    >
                      {t.name}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Additional Info Box */}
          <div className="p-6 space-y-2 text-sm text-gray-700 border border-border rounded-xl">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 font-playfair">
              Additional Info
            </h3>
            <p>
              <strong>Weight:</strong> {product.weight ?? "N/A"}
            </p>
            {product.dimensions && (
              <p>
                <strong>Dimensions:</strong> {product.dimensions.length} ×{" "}
                {product.dimensions.width} × {product.dimensions.height}
              </p>
            )}
            {formatDate(product.date_created) && (
              <p>
                <strong>Created:</strong> {formatDate(product.date_created)}
              </p>
            )}
            {formatDate(product.date_modified) && (
              <p>
                <strong>Modified:</strong> {formatDate(product.date_modified)}
              </p>
            )}
          </div>

          {/* Store Info Box */}
          {product.store && (
            <div className="p-6 text-gray-800 border border-border rounded-xl bg-gray-50 col-span-full">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 font-playfair">
                Store Info
              </h3>
              <p className="font-medium">
                🏪 {product.store.shop_name || product.store.name || "Unknown Store"}
              </p>
              {product.store.url && (
                <a
                  href={product.store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Visit Store
                </a>
              )}
              {product.store.address && product.store.address.length > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  Address: {product.store.address.join(", ")}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
