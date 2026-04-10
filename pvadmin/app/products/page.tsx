"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const CATEGORY_OPTIONS = [
  "Feed & Fodder",
  "Health & Supplements",
  "Grooming & Care",
  "Equipment",
] as const;

type Product = {
  id: number;
  category: (typeof CATEGORY_OPTIONS)[number];
  name: string;
  description: string | null;
  image1: string | null;
  image2: string | null;
  contact: string;
  created_at: string;
};

type ProductForm = {
  category: (typeof CATEGORY_OPTIONS)[number];
  name: string;
  description: string;
  contact: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const initialForm: ProductForm = {
  category: "Feed & Fodder",
  name: "",
  description: "",
  contact: "",
};

const resolveImageUrl = (imageUrl: string | null) => {
  if (!imageUrl) return "https://placehold.co/600x400?text=No+Image";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
  return `${BACKEND_URL}${imageUrl}`;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [selectedImage1, setSelectedImage1] = useState<File | null>(null);
  const [selectedImage2, setSelectedImage2] = useState<File | null>(null);
  const [previewUrl1, setPreviewUrl1] = useState<string | null>(null);
  const [previewUrl2, setPreviewUrl2] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [existingImageUrl1, setExistingImageUrl1] = useState<string | null>(null);
  const [existingImageUrl2, setExistingImageUrl2] = useState<string | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const sortedProducts = useMemo(
    () =>
      [...products].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [products],
  );

  const resetForm = () => {
    setForm(initialForm);
    setSelectedImage1(null);
    setSelectedImage2(null);
    setPreviewUrl1(null);
    setPreviewUrl2(null);
    setEditingProductId(null);
    setExistingImageUrl1(null);
    setExistingImageUrl2(null);
  };

  const fetchProducts = async () => {
    setIsLoadingList(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/products`);
      if (!response.ok) {
        throw new Error("Failed to fetch products.");
      }
      const data = (await response.json()) as Product[];
      setProducts(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error occurred.";
      setErrorMessage(message);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    void fetchProducts();
  }, []);

  useEffect(() => {
    if (!selectedImage1) {
      setPreviewUrl1(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedImage1);
    setPreviewUrl1(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage1]);

  useEffect(() => {
    if (!selectedImage2) {
      setPreviewUrl2(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedImage2);
    setPreviewUrl2(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage2]);

  const handleStartEdit = (product: Product) => {
    setEditingProductId(product.id);
    setForm({
      category: product.category,
      name: product.name,
      description: product.description ?? "",
      contact: product.contact,
    });
    setExistingImageUrl1(resolveImageUrl(product.image1));
    setExistingImageUrl2(resolveImageUrl(product.image2));
    setSelectedImage1(null);
    setSelectedImage2(null);
    setPreviewUrl1(null);
    setPreviewUrl2(null);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("category", form.category);
    formData.append("name", form.name.trim());
    formData.append("description", form.description.trim());
    formData.append("contact", form.contact.trim());
    if (selectedImage1) {
      formData.append("image1", selectedImage1);
    }
    if (selectedImage2) {
      formData.append("image2", selectedImage2);
    }
    return formData;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!form.name.trim()) {
      setErrorMessage("Name is required.");
      return;
    }
    if (!form.contact.trim()) {
      setErrorMessage("Contact number is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const isEdit = editingProductId !== null;
      const url = isEdit
        ? `${BACKEND_URL}/api/products/${editingProductId}`
        : `${BACKEND_URL}/api/products`;
      const method = isEdit ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        body: buildFormData(),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const detail = payload?.detail
          ? typeof payload.detail === "string"
            ? payload.detail
            : "Validation failed."
          : "Failed to save product.";
        throw new Error(detail);
      }

      setSuccessMessage(isEdit ? "Product updated successfully." : "Product created successfully.");
      resetForm();
      await fetchProducts();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error occurred.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/products/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete product.");
      }
      if (editingProductId === id) {
        resetForm();
      }
      setSuccessMessage("Product deleted successfully.");
      await fetchProducts();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error occurred.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <p className="text-sm text-slate-600">Manage marketplace products and inventory visuals.</p>
      </div>

      {errorMessage ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorMessage}</div> : null}
      {successMessage ? (
        <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{successMessage}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          {editingProductId ? "Edit Product" : "Add Product"}
        </h2>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <select
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                category: e.target.value as ProductForm["category"],
              }))
            }
            required
          >
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Contact number"
            value={form.contact}
            onChange={(e) => setForm((prev) => ({ ...prev, contact: e.target.value }))}
            required
          />
          <textarea
            className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
            placeholder="Description"
            rows={4}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedImage1(e.target.files?.[0] ?? null)}
          />
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedImage2(e.target.files?.[0] ?? null)}
          />

          {(previewUrl1 || existingImageUrl1 || previewUrl2 || existingImageUrl2) && (
            <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
              <p className="md:col-span-2 text-xs font-medium text-slate-500">Image Preview</p>
              <img
                src={previewUrl1 ?? existingImageUrl1 ?? "https://placehold.co/300x200?text=Image+1"}
                alt="Product preview 1"
                className="h-36 w-36 rounded-lg border border-slate-200 object-cover"
              />
              <img
                src={previewUrl2 ?? existingImageUrl2 ?? "https://placehold.co/300x200?text=Image+2"}
                alt="Product preview 2"
                className="h-36 w-36 rounded-lg border border-slate-200 object-cover"
              />
            </div>
          )}

          <div className="flex gap-2 md:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-[#1F6559] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a564c] disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : editingProductId ? "Update Product" : "Create Product"}
            </button>
            {editingProductId ? (
              <button
                type="button"
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Product List</h2>
          {isLoadingList ? <span className="text-sm text-slate-500">Loading...</span> : null}
        </div>

        {sortedProducts.length === 0 && !isLoadingList ? (
          <p className="text-sm text-slate-500">No products found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedProducts.map((product) => (
              <article key={product.id} className="rounded-lg border border-slate-200 p-3">
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <img
                    src={resolveImageUrl(product.image1)}
                    alt={`${product.name} image 1`}
                    className="h-28 w-full rounded-md bg-slate-100 object-cover"
                  />
                  <img
                    src={resolveImageUrl(product.image2)}
                    alt={`${product.name} image 2`}
                    className="h-28 w-full rounded-md bg-slate-100 object-cover"
                  />
                </div>
                <p className="mb-1 inline-block rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                  {product.category}
                </p>
                <h3 className="text-base font-semibold text-slate-900">{product.name}</h3>
                <p className="line-clamp-2 text-sm text-slate-600">{product.description || "No description"}</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{product.contact}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-100"
                    onClick={() => handleStartEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                    onClick={() => void handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}