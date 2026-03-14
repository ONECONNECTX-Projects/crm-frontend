"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn } from "@/app/common/DataTable";
import Pagination from "@/app/common/pagination";
import { downloadExcel, printPDF } from "@/app/utils/exportUtils";
import { useRouter } from "next/navigation";
import { useError } from "@/app/providers/ErrorProvider";
import { getLoggedInUser } from "@/app/utils/apiClient";
import { getAllViews, ProductView } from "@/app/services/documents/documents";

export default function ProductViewsPage() {
  const { showError } = useError();
  const router = useRouter();

  // Restrict access to Super Admin only
  useEffect(() => {
    const user = getLoggedInUser();
    if (!user || user.name !== "Super Admin") {
      showError("Access denied. Super Admin only.");
      router.push("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [views, setViews] = useState<ProductView[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalServerItems, setTotalServerItems] = useState(0);

  const [columns, setColumns] = useState([
    { key: "sNo", label: "Sr.No", visible: true },
    { key: "email", label: "Email", visible: true },
    { key: "mobile", label: "Mobile", visible: true },
    { key: "productName", label: "Product Name", visible: true },
    { key: "productType", label: "Product Type", visible: true },
    { key: "context", label: "Context", visible: true },
    { key: "viewType", label: "View Type", visible: true },
    { key: "ip", label: "IP Address", visible: true },
    { key: "createdAt", label: "Viewed At", visible: true },
  ]);

  /* =========================
     Fetch Views
  ========================== */
  const fetchViews = async () => {
    setLoading(true);
    try {
      // Pass the current page and page size to the API
      const response = await getAllViews(currentPage, pageSize);

      setViews(response.views || []);
      setTotalServerItems(response.total || 0); // Store total count from DB for pagination
    } catch (error) {
      console.error("Failed to fetch views:", error);
      showError("Failed to load views");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch data whenever the page or page size changes
  useEffect(() => {
    fetchViews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  /* =========================
     Column Toggle
  ========================== */
  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  /* =========================
     Table Columns
  ========================== */
  const tableColumns: TableColumn<ProductView & { sNo: number }>[] =
    columns.map((col) => ({
      key: col.key as keyof (ProductView & { sNo: number }),
      label: col.label,
      visible: col.visible,
      render: (row) => {
        if (col.key === "sNo") {
          return <span className="text-gray-500">{row.sNo}</span>;
        }

        if (col.key === "productName") {
          return <span>{row.product?.name || "-"}</span>;
        }

        if (col.key === "productType") {
          return <span>{row.product?.productType || "-"}</span>;
        }

        if (col.key === "viewType") {
          return <span>{row.all ? "All Documents" : "Single Product"}</span>;
        }

        if (col.key === "createdAt") {
          return (
            <span>
              {new Date(row.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          );
        }

        const value = row[col.key as keyof ProductView];
        return <span>{value ? String(value) : "-"}</span>;
      },
    }));

  /* =========================
     Search (Client-side on current page)
  ========================== */
  const filteredViews = views.filter((view) =>
    [
      view.email,
      view.mobile,
      view.ip,
      view.product?.name,
      view.product?.productType,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );

  /* =========================
     Data Formatting for Table
  ========================== */
  const startIndex = (currentPage - 1) * pageSize;

  // We no longer need to .slice() because the API already gave us exactly 1 page of data
  const tableData = filteredViews.map((item, index) => ({
    ...item,
    sNo: startIndex + index + 1,
  }));

  /* =========================
     Export
  ========================== */
  const extractors: Record<string, (row: ProductView) => string> = {
    productName: (row) => row.product?.name || "-",
    productType: (row) => row.product?.productType || "-",
    viewType: (row) => (row.all ? "All Documents" : "Single Product"),
    createdAt: (row) => new Date(row.created_at).toLocaleDateString("en-US"),
  };

  const handleDownloadExcel = () => {
    downloadExcel(filteredViews, columns, "product_views", extractors);
  };

  const handlePrintPDF = () => {
    printPDF(filteredViews, columns, "Product Views", extractors);
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader title="Product Document Views" showCreateButton={false} />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search views..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={handlePrintPDF}
          onDownloadExcel={handleDownloadExcel}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading views...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={tableData}
            emptyMessage="No views found."
          />
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={totalServerItems} // Now properly uses the total count from your DB
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
