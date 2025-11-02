"use client";

import React from "react";
import Image from "next/image";
import { Product } from "./hooks/useProducts";

interface Props {
  product: Product;
  onClose: () => void;
  onUpdated?: () => void;
}

export default function ProductDetailsModal({ product, onClose }: Props) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-[95%] max-w-4xl relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Product Details — {product.name || "Untitled"}
          </h2>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Image & Pricing */}
          <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/70 hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800 mb-3">🖼️ Product Overview</h3>

            <div className="w-full h-64 rounded-xl bg-gray-100 overflow-hidden mb-4 flex items-center justify-center">
              <Image
                src={product.images?.[0]?.src || "/placeholder.png"}
                alt={product.name}
                width={300}
                height={300}
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                }}
              />
            </div>

            {/* Pricing */}
            <div className="space-y-2 text-sm text-gray-800">
              <p>
                <b>Type:</b> {product.type || "N/A"}
              </p>
              <p>
                <b>Stock Status:</b>{" "}
                <span
                  className={`font-medium ${product.stock_status === "instock"
                      ? "text-green-600"
                      : "text-red-500"
                    }`}
                >
                  {product.stock_status || "—"}
                </span>
              </p>

              {typeof product.stock_quantity === "number" && (
                <p>
                  <b>Quantity Available:</b> {product.stock_quantity}
                </p>
              )}

              <div className="pt-2 border-t border-gray-200">
                {product.on_sale ? (
                  <p className="text-lg font-semibold text-green-600">
                    Sale Price: ₹{product.sale_price || product.price}
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ₹{product.regular_price}
                    </span>
                  </p>
                ) : (
                  <p className="text-lg font-semibold text-gray-900">
                    Price: ₹{product.price || product.regular_price || "N/A"}
                  </p>
                )}
                {product.on_sale && (
                  <p className="text-xs text-green-600 mt-1 font-medium">
                    🎉 On Sale
                  </p>
                )}
              </div>

              {product.sku && (
                <p>
                  <b>SKU:</b> <span className="text-gray-700">{product.sku}</span>
                </p>
              )}

              {product.rating_count ? (
                <p>
                  <b>Ratings:</b> ⭐ {product.average_rating} ({product.rating_count})
                </p>
              ) : (
                <p>
                  <b>Ratings:</b> Not Rated
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/70 hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800 mb-3">📝 Description</h3>
            <div
              className="prose text-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html:
                  product.short_description ||
                  product.description ||
                  "<i>No description available</i>",
              }}
            />
          </div>

          {/* Categories, Tags, and Store */}
          <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/70 hover:shadow-md transition md:col-span-2">
            <h3 className="font-semibold text-gray-800 mb-3">🏷️ Categories, Tags & Store</h3>

            <div className="flex flex-wrap gap-2 text-sm mb-3">
              {(product.categories || []).map((c) => (
                <span
                  key={c.id}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                >
                  {c.name}
                </span>
              ))}
              {(product.tags || []).map((t) => (
                <span
                  key={t.id}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                >
                  {t.name}
                </span>
              ))}
              {!product.categories?.length && !product.tags?.length && (
                <span className="text-gray-500 text-xs">
                  No categories or tags available
                </span>
              )}
            </div>

            {/* Store Info */}
            {product.store && (
              <div className="p-3 rounded-xl bg-gray-100 flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    🏪 {product.store.shop_name || product.store.name}
                  </p>
                  {product.store.url && (
                    <a
                      href={product.store.url}
                      target="_blank"
                      className="text-blue-600 text-xs hover:underline"
                    >
                      Visit Store
                    </a>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2 md:mt-0">
                  Store ID: {product.store.id}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
