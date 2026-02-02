import * as XLSX from "xlsx";

export interface ExportColumn {
  key: string;
  label: string;
  visible?: boolean;
}

/**
 * Extracts the display value from a data row for a given column key
 * Handles nested objects like owner.name, company.name, etc.
 */
function getDisplayValue(row: Record<string, unknown>, key: string): string {
  const value = row[key];

  if (value === null || value === undefined || value === "") {
    return "-";
  }

  // Handle nested objects (e.g., owner, company, source, stage, industry)
  if (typeof value === "object" && value !== null) {
    const objValue = value as Record<string, unknown>;
    // Most common pattern: object with 'name' property
    if (objValue.name !== undefined) {
      return String(objValue.name) || "-";
    }
    // Try to stringify if it's an object without name
    return JSON.stringify(value);
  }

  // Handle dates
  if (key.includes("date") || key.includes("created_at") || key.includes("updated_at")) {
    const date = new Date(String(value));
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString();
    }
  }

  return String(value);
}

/**
 * Prepares data for export based on visible columns
 */
function prepareExportData<T>(
  data: T[],
  columns: ExportColumn[],
  customExtractors?: Record<string, (row: T) => string>
): { headers: string[]; rows: string[][] } {
  const visibleColumns = columns.filter((col) => col.visible !== false);
  const headers = visibleColumns.map((col) => col.label);

  const rows = data.map((row) =>
    visibleColumns.map((col) => {
      // Use custom extractor if provided
      if (customExtractors && customExtractors[col.key]) {
        return customExtractors[col.key](row);
      }
      return getDisplayValue(row as Record<string, unknown>, col.key);
    })
  );

  return { headers, rows };
}

/**
 * Downloads data as an Excel file
 * Only exports columns that have visible: true (or visible not set to false)
 */
export function downloadExcel<T>(
  data: T[],
  columns: ExportColumn[],
  filename: string = "export",
  customExtractors?: Record<string, (row: T) => string>
): void {
  const { headers, rows } = prepareExportData(data, columns, customExtractors);

  // Create worksheet data with headers
  const worksheetData = [headers, ...rows];

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths based on content
  const colWidths = headers.map((header, index) => {
    const maxContentLength = Math.max(
      header.length,
      ...rows.map((row) => (row[index] || "").length)
    );
    return { wch: Math.min(Math.max(maxContentLength + 2, 10), 50) };
  });
  worksheet["!cols"] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Generate and download file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Opens print dialog with formatted table data
 * Only prints columns that have visible: true (or visible not set to false)
 */
export function printPDF<T>(
  data: T[],
  columns: ExportColumn[],
  title: string = "Data Export",
  customExtractors?: Record<string, (row: T) => string>
): void {
  const { headers, rows } = prepareExportData(data, columns, customExtractors);

  // Create table HTML
  const tableRows = rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`
    )
    .join("");

  const tableHeaders = headers
    .map((header) => `<th>${escapeHtml(header)}</th>`)
    .join("");

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${escapeHtml(title)}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #333;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #333;
        }
        .header h1 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 5px;
        }
        .header .date {
          font-size: 12px;
          color: #666;
        }
        .header .count {
          font-size: 11px;
          color: #888;
          margin-top: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px 10px;
          text-align: left;
        }
        th {
          background-color: #f5f5f5;
          font-weight: 600;
          color: #333;
          white-space: nowrap;
        }
        tr:nth-child(even) {
          background-color: #fafafa;
        }
        tr:hover {
          background-color: #f0f0f0;
        }
        td {
          word-wrap: break-word;
          max-width: 200px;
        }
        @media print {
          body {
            padding: 0;
          }
          .header {
            page-break-after: avoid;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${escapeHtml(title)}</h1>
        <div class="date">Generated on: ${new Date().toLocaleString()}</div>
        <div class="count">Total Records: ${rows.length}</div>
      </div>
      <table>
        <thead>
          <tr>${tableHeaders}</tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Open print window
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };

    // Fallback for browsers that don't fire onload
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  } else {
    alert("Please allow popups to print the document");
  }
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
