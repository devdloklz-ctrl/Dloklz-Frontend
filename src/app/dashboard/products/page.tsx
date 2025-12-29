"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import ProductTable from "@/components/products/ProductTable";
import Pagination from "@/components/common/Pagination";
import type { Product } from "@/types/product";
import ProductDetailsModal from "@/components/products/ProductDetailsModal";

type InStockFilter = "all" | "true" | "false";
type SortOption = "newest" | "price_asc" | "price_desc";

interface Category {
  id: number;
  name: string;
  slug: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [inStock, setInStock] = useState<InStockFilter>("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [error, setError] = useState("");

  const limit = 10;
  const debouncedSearch = useDebounce(search, 500);

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const res = await api.get("/products/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, inStock, selectedCategory, sort]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const params: Record<string, string | number> = { page, limit };
        if (debouncedSearch) params.search = debouncedSearch;
        if (inStock !== "all") params.in_stock = inStock;
        if (selectedCategory !== "all") params.category = selectedCategory;
        if (sort) params.sort = sort;

        const token = localStorage.getItem("token") || "";

        const response = await api.get("/products", {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProducts(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, debouncedSearch, inStock, selectedCategory, sort]);

  const handleView = (product: Product) => setSelectedProduct(product);
  const handleCloseModal = () => setSelectedProduct(null);

  return (
    <section className="px-8 py-10 space-y-6">
      <h1 className="mb-4 text-2xl font-semibold font-brand">Products</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded grow border-ui-border focus:outline-none focus:ring focus:ring-brand-primary"
        />

        <select
          value={inStock}
          onChange={(e) => setInStock(e.target.value as InStockFilter)}
          className="px-4 py-2 border rounded border-ui-border focus:outline-none focus:ring focus:ring-brand-primary"
        >
          <option value="all">All stock statuses</option>
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded border-ui-border focus:outline-none focus:ring focus:ring-brand-primary"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="px-4 py-2 border rounded border-ui-border focus:outline-none focus:ring focus:ring-brand-primary"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Loading & Error */}
      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && products.length === 0 && <p>No products found.</p>}

      {/* Product Table */}
      <ProductTable products={products} onView={handleView} />

      {/* Product Detail Modal */}
      <ProductDetailsModal product={selectedProduct} onClose={handleCloseModal} />

      {/* Pagination */}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </section>
  );
}
