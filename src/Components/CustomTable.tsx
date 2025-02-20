import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { tItemTable } from "../types/types";
const defaultImage = require('../Assets/Image/groupCLPP.png');

export default function TableComponent(props: { list: tItemTable[], onConfirmList: (selected: tItemTable[]) => void }) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<tItemTable[]>([]);

  const columnKeys = Object.keys(props.list[0]);
  const columnHeaders = columnKeys.reduce((acc, key) => {
    acc[key] = props.list[0][key].tag;
    return acc;
  }, {} as { [key: string]: string });

  const sortedItemTable = [...props.list].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const valueA = a[key].value.toLowerCase();
    const valueB = b[key].value.toLowerCase();
    return direction === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  });

  const filteredItemsTable = sortedItemTable.filter((item) =>
    Object.keys(filters).every((key) =>
      item[key].value.toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  function handleSort(key: string) {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  }

  function handleFilterChange(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function toggleRowSelection(item: tItemTable) {
    setSelectedRows((prev) => {
      return prev.includes(item) ? prev.filter((row) => row !== item) : [...prev, item];
    });
  }

  function RenderCell(props: { value: string; isImage?: boolean }) {
    return props.isImage ? (
      <img className="photoCircle rounded-circle" src={props.value ? `data:image/png;base64,${props.value}` : defaultImage} />
    ) : (
      <span>{props.value}</span>
    );
  }

  return (
    <div className="d-flex flex-column w-100 h-100 p-3">
      <div className="overflow-auto">
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              {columnKeys.filter((key) => !props.list[0][key].ocultColumn).map((key) => (
                <th key={key} className="position-relative">
                  <div className="d-flex justify-content-between align-items-center">
                    {activeFilter === key ? (
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Filtrar"
                        autoFocus
                        value={filters[key] || ""}
                        onChange={(e) => handleFilterChange(key, e.target.value)}
                        onBlur={() => setActiveFilter(null)}
                      />
                    ) : (
                      <span onClick={() => handleSort(key)}>
                        {columnHeaders[key]} {sortConfig?.key === key ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </span>
                    )}
                    <button className="btn btn-sm btn-light ms-2" onClick={(e) => { e.stopPropagation(); setActiveFilter(activeFilter === key ? null : key); }}>
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredItemsTable.map((item, index) => (
              <tr key={index} className={selectedRows.includes(item) ? "table-success" : ""} onClick={() => toggleRowSelection(item)}>
                {columnKeys.map((key) => !item[key].ocultColumn && (
                  <td key={key} className="py-2">
                    <RenderCell isImage={item[key].isImage} value={item[key]?.value} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn btn-primary mt-3" onClick={() => props.onConfirmList(selectedRows)}>
        Confirmar Seleção
      </button>
    </div>
  );
};
