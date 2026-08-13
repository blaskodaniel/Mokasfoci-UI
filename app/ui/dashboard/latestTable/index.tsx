import { Container } from "@ui/global.style";

import { Avatart, Table } from "./transactions.style";
import { Title } from "@ui/global/CommonStyles";
import { LatestTableProps } from "./type";

function LatestTable<T>({ columns, data, title }: LatestTableProps<T> & { data: T[] }) {
  return (
    <div className={Container}>
      <h2 className={Title}>{title}</h2>
      <div style={{ maxHeight: 450, overflowY: "auto" }}>
        <table className={Table}>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <td key={idx}>{col.header}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center text-xs text-gray-500">
                  Nincsenek még tranzakciók
                </td>
              </tr>
            )}
            {data.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx}>
                    {typeof col.render === "function" ? (col.render as (row: T) => React.ReactNode)(row) : col.render}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LatestTable;
