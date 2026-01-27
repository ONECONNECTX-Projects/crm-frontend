"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";
import {
  deleteQuote,
  getAllQuote,
  Quote,
} from "@/app/services/quote/quote.service";
import { useError } from "@/app/providers/ErrorProvider";
import CreateQuote from "./Create/page";

export default function QuotePage() {
  const { showSuccess, showError } = useError();
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [quotes, setQuoteList] = useState<Quote[]>([]);

  const [columns, setColumns] = useState([
    { key: "id", label: "ID", visible: true },
    { key: "name", label: "Name", visible: true },
    { key: "owner", label: "Owner", visible: true },

    { key: "quote_date", label: "Quotation Date", visible: true },
    { key: "expiry_date", label: "Expiration Date", visible: true },
    {
      key: "amount",
      label: "Total Amount",
      visible: true,
    },
    {
      key: "company",
      label: "Company",
      visible: true,
    },
    {
      key: "contact",
      label: "Contact",
      visible: true,
    },
    { key: "opportunity", label: "Opportunity", visible: true },
    {
      key: "createdAt",
      label: "Create Date",
      visible: true,
    },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await getAllQuote();
      setQuoteList(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Quote:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const actions: TableAction<Quote>[] = [
    {
      label: "View",
      onClick: (row) => console.log("View quote", row),
    },
    {
      label: "Edit",
      onClick: (row) => {
        setEditId(row.id);
        setOpenCreate(true);
      },
    },
    {
      label: "Convert to Invoice",
      onClick: (row) => console.log("Convert to invoice", row),
    },
    {
      label: "Send Email",
      onClick: (row) => console.log("Send email", row),
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => handleDelete(row),
    },
  ];

  const handleDelete = async (quote: Quote) => {
    if (window.confirm(`Are you sure you want to delete "${quote?.name}"?`)) {
      try {
        await deleteQuote(quote.id);
        showSuccess("Quote deleted successfully");
        fetchQuote();
      } catch (error) {
        console.error("Failed to delete Quote:", error);
        showError("Failed to delete Quote");
      }
    }
  };

  const filtered = quotes.filter((quote) =>
    `${quote.company.name} ${quote.contact.name} ${quote.owner.name} ${quote.stage.name}`
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );

  const totalItems = filtered.length;
  const paginatedData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const tableColumns: TableColumn<Quote>[] = columns.map((col) => ({
    key: col.key as keyof Quote,
    label: col.label,
    visible: col.visible,
    render: (row) => {
      let value: any;

      switch (col.key) {
        case "owner":
          value = row.owner?.name;
          break;

        case "company":
          value = row.company?.name;
          break;

        case "contact":
          value = row.contact ? `${row.contact.name}` : "";
          break;

        case "stage":
          value = row.stage?.name;
          break;

        case "opportunity":
          value = row.stage?.name;
          break;

        case "amount":
          value = row.total_amount;
          break;

        case "quote_date": {
          return (
            <span>
              {new Date(row.quote_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          );
        }
        case "expiry_date": {
          return (
            <span>
              {new Date(row.expiry_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          );
        }

        case "createdAt": {
          return (
            <span>
              {new Date(row.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          );
        }
        case "createdAt": {
          return (
            <span>
              {new Date(row.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          );
        }
        default:
          value = row[col.key as keyof Quote];
      }

      return (
        <span className="truncate block max-w-[300px]">
          {String(value ?? "")}
        </span>
      );
    },
  }));

  return (
    <div className="bg-white rounded-xl p-6 space-y-6">
      <PageHeader
        title="Quotes"
        createButtonText="Create Quote"
        onCreateClick={() => {
          setEditId(null);
          setOpenCreate(true);
        }}
      />

      <PageActions
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          setCurrentPage(1);
        }}
        columns={columns}
        onColumnToggle={handleColumnToggle}
      />

      <DataTable
        columns={tableColumns}
        data={paginatedData}
        actions={actions}
        emptyMessage="No quotes found."
      />

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      <SlideOver
        open={openCreate}
        onClose={() => {
          setOpenCreate(false);
          setEditId(null);
        }}
      >
        <div className="p-6">
          <CreateQuote
            editId={editId}
            onClose={() => {
              setOpenCreate(false);
              setEditId(null);
            }}
            onSuccess={() => {
              fetchQuote();
            }}
          />
        </div>
      </SlideOver>
    </div>
  );
}
