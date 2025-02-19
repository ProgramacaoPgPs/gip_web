import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { tItemTable } from "../types/types";

export default function TableComponent(props: { list: tItemTable[] }) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Pega as chaves (campos) do primeiro usuário para definir os títulos das colunas
  const columnKeys = Object.keys(props.list[0]);
  const columnHeaders = columnKeys.reduce((acc, key) => {
    acc[key] = props.list[0][key].tag; // Usa `tag` como título da coluna
    return acc;
  }, {} as { [key: string]: string });

  // Ordenação
  const sortedItemTable = [...props.list].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const valueA = a[key].value.toLowerCase();
    const valueB = b[key].value.toLowerCase();
    return direction === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  });

  // Filtragem
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
  };

  function handleFilterChange(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="d-flex flex-column w-100 h-100 p-3">
      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            {columnKeys.map((key) => (
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
        <tbody className="overflow-auto">
          {filteredItemsTable.map((item, index) => (
            <tr key={index}>
              {columnKeys.map((key) => (
                <td key={key} className="py-2">{item[key].isImage ? "É uma imagem" : item[key]?.value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

