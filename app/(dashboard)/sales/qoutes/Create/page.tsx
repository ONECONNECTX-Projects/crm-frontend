"use client";
import React, { useState, useEffect } from "react";
import { Trash2, Plus, Calendar, X } from "lucide-react";
import {
  createQuote,
  updateQuote,
  getQuoteById,
  QuotePayload,
  Item,
} from "@/app/services/quote/quote.service";
import { getAllActiveUsers } from "@/app/services/user/user.service";
import { getAllActiveContacts } from "@/app/services/contact/contact.service";
import {
  getAllActiveProducts,
  getProductById,
} from "@/app/services/product/product.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { useError } from "@/app/providers/ErrorProvider";
import { getAllActiveCompany } from "@/app/services/company/company.service";
import { getAllActiveOpportunity } from "@/app/services/opportunity/opportunity.service";
import { getAllActiveQuoteStages } from "@/app/services/quote-stage-setup/quote-stage-setup.service";

interface ProductRow {
  id: number;
  product_id: number;
  qty: number;
  price: number;
  discount: number;
}

interface CreateQuoteProps {
  editId?: number | null;
  onClose?: () => void;
  onSuccess?: () => void;
}

const CreateQuote = ({ editId, onClose, onSuccess }: CreateQuoteProps) => {
  const { showSuccess, showError } = useError();
  const isEditMode = !!editId;

  const [formData, setFormData] = useState({
    name: "",
    quote_date: "",
    expiration_date: "",
    owner_id: 0,
    company_id: 0,
    contact_id: 0,
    opportunity_id: 0,
    quote_stage_id: 0,
    terms: "",
    description: "",
  });

  const [products, setProducts] = useState<ProductRow[]>([
    { id: 1, product_id: 0, qty: 1, price: 0, discount: 0 },
  ]);

  const [owners, setOwners] = useState<OptionDropDownModel[]>([]);
  const [companies, setCompanies] = useState<OptionDropDownModel[]>([]);
  const [contacts, setContacts] = useState<OptionDropDownModel[]>([]);
  const [opportunities, setOpportunities] = useState<OptionDropDownModel[]>([]);
  const [quoteStages, setQuoteStages] = useState<OptionDropDownModel[]>([]);
  const [productOptions, setProductOptions] = useState<OptionDropDownModel[]>(
    [],
  );

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [
          ownersRes,
          companiesRes,
          contactsRes,
          opportunitiesRes,
          stagesRes,
          productsRes,
        ] = await Promise.all([
          getAllActiveUsers(),
          getAllActiveCompany(),
          getAllActiveContacts(),
          getAllActiveOpportunity(),
          getAllActiveQuoteStages(),
          getAllActiveProducts(),
        ]);

        setOwners(ownersRes.data || []);
        setCompanies(companiesRes.data || []);
        setContacts(contactsRes.data || []);
        setOpportunities(opportunitiesRes.data || []);
        setQuoteStages(stagesRes.data || []);
        setProductOptions(productsRes.data || []);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };
    fetchDropdownData();
  }, []);

  useEffect(() => {
    const fetchQuoteData = async () => {
      if (!editId) return;
      setFetchingData(true);
      try {
        const response = await getQuoteById(editId);
        if (response.isSuccess && response.data) {
          const quote = response.data;
          setFormData({
            name: quote.name || "",
            quote_date: quote.quote_date ? quote.quote_date.split("T")[0] : "",
            expiration_date: quote.expiry_date
              ? quote.expiry_date.split("T")[0]
              : "",
            owner_id: quote.owner_id || 0,
            company_id: quote.company_id || 0,
            contact_id: quote.contact_id || 0,
            opportunity_id: quote.opportunity_id || 0,
            quote_stage_id: quote.quote_stage_id || 0,
            terms: quote.terms || "",
            description: quote.description || "",
          });

          if (quote.items && quote.items.length > 0) {
            setProducts(
              quote.items.map((item: any, index: number) => ({
                id: index + 1,
                product_id: item.product_id,
                qty: item.quantity,
                price: parseFloat(item.price),
                discount: parseFloat(item.discount),
              })),
            );
          }
        }
      } catch (error) {
        showError("Failed to load quote data");
      } finally {
        setFetchingData(false);
      }
    };
    fetchQuoteData();
  }, [editId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("_id") && value ? parseInt(value) : value,
    }));
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { id: Date.now(), product_id: 0, qty: 1, price: 0, discount: 0 },
    ]);
  };

  const removeProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // UPDATED: Async update that fetches product details
  const updateProduct = async (
    id: number,
    field: string,
    value: string | number,
  ) => {
    const numValue = typeof value === "string" ? parseFloat(value) || 0 : value;

    // Update the row state immediately for the changed field
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: numValue } : p)),
    );

    // If product selection changed, fetch the price
    if (field === "product_id" && numValue !== 0) {
      try {
        const res = await getProductById(numValue as number);
        if (res.data) {
          const fetchedPrice = parseFloat(res.data.rate) || 0;
          setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, price: fetchedPrice } : p)),
          );
        }
      } catch (error) {
        console.error("Error fetching product price:", error);
      }
    }
  };

  const calculateTotal = () => {
    return products
      .reduce((acc, p) => acc + (p.qty * p.price - p.discount), 0)
      .toFixed(2);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return showError("Quote name is required");
    if (!formData.contact_id) return showError("Contact is required");

    setLoading(true);
    try {
      const items: Item[] = products
        .filter((p) => p.product_id > 0)
        .map((p) => ({
          product_id: p.product_id,
          quantity: p.qty,
          price: p.price,
          discount: p.discount,
        }));

      const payload: QuotePayload = {
        ...formData,
        quote_date: formData.quote_date
          ? new Date(formData.quote_date)
          : new Date(),
        expiration_date: formData.expiration_date
          ? new Date(formData.expiration_date)
          : new Date(),
        items,
      };

      const response =
        isEditMode && editId
          ? await updateQuote(editId, payload)
          : await createQuote(payload);

      if (response.isSuccess) {
        showSuccess(
          isEditMode
            ? "Quote updated successfully"
            : "Quote created successfully",
        );
        onSuccess?.();
        onClose?.();
      } else {
        showError(response.message || "Operation failed");
      }
    } catch (error) {
      showError("Failed to save quote");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData)
    return <div className="p-6 text-center">Loading quote data...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <X
            className="w-5 h-5 text-gray-400 cursor-pointer"
            onClick={onClose}
          />
          {isEditMode ? "Edit Quote" : "Create Quote"}
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            <span className="text-red-500">*</span> Quote name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border rounded p-2 outline-none"
            placeholder="Enter quote name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quote Owner</label>
          <select
            name="owner_id"
            value={formData.owner_id}
            onChange={handleInputChange}
            className="w-full border rounded p-2 bg-gray-50"
          >
            <option value={0}>Select Owner</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quote date</label>
          <input
            type="date"
            name="quote_date"
            value={formData.quote_date}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Expiration date
          </label>
          <input
            type="date"
            name="expiration_date"
            value={formData.expiration_date}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Company{" "}
            <span className="bg-brand-500 text-white px-1 rounded text-xs">
              +
            </span>
          </label>
          <select
            name="company_id"
            value={formData.company_id}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          >
            <option value={0}>Select company Name</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Opportunity</label>
          <select
            name="opportunity_id"
            value={formData.opportunity_id}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          >
            <option value={0}>Select opportunity</option>
            {opportunities.map((opp) => (
              <option key={opp.id} value={opp.id}>
                {opp.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            <span className="text-red-500">*</span> Contact{" "}
            <span className="bg-brand-500 text-white px-1 rounded text-xs">
              +
            </span>
          </label>
          <select
            name="contact_id"
            value={formData.contact_id}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          >
            <option value={0}>Select contact name</option>
            {contacts.map((con) => (
              <option key={con.id} value={con.id}>
                {con.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quote stage</label>
          <select
            name="quote_stage_id"
            value={formData.quote_stage_id}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          >
            <option value={0}>Select stage</option>
            {quoteStages.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">
            Terms and conditions
          </label>
          <input
            type="text"
            name="terms"
            value={formData.terms}
            onChange={handleInputChange}
            className="w-full border rounded p-2 text-sm"
            placeholder="Terms"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border rounded p-2 h-20 text-sm"
            placeholder="description"
          />
        </div>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2 font-medium">SL</th>
              <th className="py-2 font-medium w-1/4">Product</th>
              <th className="py-2 font-medium">Quantity</th>
              <th className="py-2 font-medium">Price</th>
              <th className="py-2 font-medium">Discount</th>
              <th className="py-2 font-medium">Total</th>
              <th className="py-2 font-medium text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="py-4">{index + 1}</td>
                <td>
                  <select
                    value={p.product_id}
                    onChange={(e) =>
                      updateProduct(
                        p.id,
                        "product_id",
                        parseInt(e.target.value),
                      )
                    }
                    className="w-full border rounded p-2 mr-2 bg-white"
                  >
                    <option value={0}>Select Product</option>
                    {productOptions.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    value={p.qty}
                    onChange={(e) => updateProduct(p.id, "qty", e.target.value)}
                    className="w-24 border rounded p-2"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={p.price}
                    onChange={(e) =>
                      updateProduct(p.id, "price", e.target.value)
                    }
                    className="w-28 border rounded p-2 bg-gray-50"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={p.discount}
                    onChange={(e) =>
                      updateProduct(p.id, "discount", e.target.value)
                    }
                    className="w-28 border rounded p-2 bg-gray-50"
                  />
                </td>
                <td className="font-medium">
                  {(p.qty * p.price - p.discount).toFixed(2)}
                </td>
                <td className="text-center">
                  <button
                    onClick={() => removeProduct(p.id)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addProduct}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 flex justify-center items-center gap-2 hover:bg-gray-50 mb-6"
      >
        <Plus className="w-4 h-4" /> Add Product
      </button>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="font-bold text-lg">Total:</span>
        <span className="font-bold text-lg">{calculateTotal()}</span>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-6 bg-brand-500 text-white font-semibold py-3 rounded-md hover:bg-brand-600 transition disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : isEditMode
            ? "Update Quotation"
            : "Create Quotation"}
      </button>
    </div>
  );
};

export default CreateQuote;
