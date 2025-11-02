"use client";

import { useState } from "react";
import { useProducts, Product } from "./hooks/useProducts";
import ProductTable from "./ProductTable";
import ProductDetailsModal from "./ProductDetailsModal";
import { FiRefreshCw } from "react-icons/fi";

export default function OwnerProductsPage() {
  const { products, loading, error, syncProducts } = useProducts();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || p.stock_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
        <button
          onClick={syncProducts}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition ${loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          <FiRefreshCw className="text-lg" />
          {loading ? "Syncing..." : "Sync with WooCommerce"}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-1/2 focus:outline-none focus:ring focus:ring-blue-200"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-1/4 focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="all">All Status</option>
          <option value="instock">In Stock</option>
          <option value="outofstock">Out of Stock</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-4 text-gray-600">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : (
          <ProductTable
            products={filteredProducts}
            onView={(p) => setSelectedProduct(p)}
          />
        )}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
