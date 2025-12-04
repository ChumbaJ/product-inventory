export interface TableColumn<T> {
  header: string;
  accessor: keyof T;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: (row: T) => React.ReactNode;
}

export const Table = <T extends object>({
  columns,
  data = [],
  actions,
}: TableProps<T>) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th key={String(column.accessor)} className="px-6 py-3">
                {column.header}
              </th>
            ))}
            <th className="px-6 py-3">Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white border-b hover:bg-gray-50">
              {columns.map((column) => (
                <td key={String(column.accessor)} className="px-6 py-4">
                  {row[column.accessor] as React.ReactNode}
                </td>
              ))}
              <td className="px-6 py-4 flex justify-end gap-5">
                {actions ? actions(row) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
