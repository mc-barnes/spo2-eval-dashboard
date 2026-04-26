/**
 * DataTable — styled HTML table with optional label color mapping.
 */
interface DataTableProps {
  columns: string[];
  rows: Array<Record<string, string | number>>;
  /** Maps cell string values to colors (e.g., "urgent" -> "#C1565B"). */
  labelColorMap?: Record<string, string>;
}

export default function DataTable({ columns, rows, labelColorMap }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr className="bg-sage-bg">
            {columns.map((col) => (
              <th
                key={col}
                className="text-left text-teal-dark border-b border-border"
                style={{
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  padding: "10px 16px",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border">
              {columns.map((col) => {
                const raw = row[col];
                const cellStr = raw == null ? "" : String(raw);
                const color = labelColorMap?.[cellStr];

                return (
                  <td
                    key={col}
                    className="text-body"
                    style={{
                      fontSize: "0.85rem",
                      padding: "10px 16px",
                      ...(color ? { color, textTransform: "capitalize" } : {}),
                    }}
                  >
                    {cellStr}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
