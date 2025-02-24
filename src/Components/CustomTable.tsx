import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { tItemTable } from "../types/types";
const defaultImage = require('../Assets/Image/groupCLPP.png');

interface TableComponentProps {
  list: tItemTable[];
  onConfirmList: (selected: tItemTable[]) => void;
  selectedItems?: tItemTable[];
  maxSelection?: number;
  selectionList?: tItemTable[]; // Nova prop: lista de objetos para seleção
  selectionKey?: string; // Nova prop: chave de referência para seleção
}

export default function TableComponent(props: TableComponentProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<tItemTable[]>(props.selectedItems || []);

  // Função para verificar se uma linha deve ser selecionada
  const isRowSelected = (row: tItemTable): boolean => {
    if (!props.selectionList || !props.selectionKey || !row[props.selectionKey]) return false;
    return props.selectionList.some(item => {
      if (!item[props.selectionKey!]) return false;
      return item[props.selectionKey!].value === row[props.selectionKey!].value;
    });
  };

  // Efeito para adicionar os itens da selectionList à lista de selecionados na primeira renderização
  useEffect(() => {
    if (props.selectionList && props.selectionKey) {
      const itemsToSelect = props.list.filter(row => isRowSelected(row));
      setSelectedRows((prev) => {
        // Evita duplicação de itens
        const newItems = itemsToSelect.filter(item => !prev.includes(item));
        return [...prev, ...newItems];
      });
    }
  }, [props.selectionList, props.selectionKey, props.list]); // Dependências do useEffect

  // Atualiza o estado selectedRows quando props.selectedItems mudar
  useEffect(() => {
    if (props.selectedItems) {
      setSelectedRows(props.selectedItems);
    }
  }, [props.selectedItems]);

  const columnKeys = Object.keys(props.list[0]);
  const columnHeaders = columnKeys.reduce((acc, key) => {
    acc[key] = props.list[0][key].tag;
    return acc;
  }, {} as { [key: string]: string });

  const sortedItemTable = [...props.list].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const valueA = a[key]?.value?.toLowerCase() || ""; // Verificação de segurança
    const valueB = b[key]?.value?.toLowerCase() || ""; // Verificação de segurança
    return direction === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  });

  const filteredItemsTable = sortedItemTable.filter((item) =>
    Object.keys(filters).every((key) =>
      item[key]?.value?.toLowerCase().includes(filters[key].toLowerCase()) // Verificação de segurança
    )
  );

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleRowSelection = (item: tItemTable) => {
    setSelectedRows((prev) => {
      if (prev.includes(item)) {
        return prev.filter((row) => row !== item); // Remove o item da lista
      } else {
        if (props.maxSelection && prev.length >= props.maxSelection) {
          return prev; // Não adiciona mais itens se o limite for atingido
        }
        return [...prev, item]; // Adiciona o item à lista
      }
    });
  };

  const RenderCell = (props: { value: string; isImage?: boolean }) => {
    return props.isImage ? (
      <img className="photoCircle rounded-circle" src={props.value ? `data:image/png;base64,${props.value}` : defaultImage} />
    ) : (
      <span>{props.value}</span>
    );
  };

  return (
    <div className="d-flex flex-column w-100 h-100 p-3">
      <div className="overflow-auto">
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              {columnKeys.filter((key) => !props.list[0][key].ocultColumn).map((key) => (
                <th key={key} className="position-relative">
                  <div style={{ minWidth: props.list[0][key].minWidth ? props.list[0][key].minWidth : "auto" }} className="d-flex justify-content-between align-items-center">
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
            {filteredItemsTable.map((item, index) => {
              const isSelected = selectedRows.includes(item);
              return (
                <tr key={index} className={isSelected ? "table-success" : ""} onClick={() => toggleRowSelection(item)}>
                  {columnKeys.map((key) => !item[key].ocultColumn && (
                    <td key={key} className="py-2">
                      <RenderCell isImage={item[key].isImage} value={item[key]?.value || ""} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="w-100 d-flex justify-content-around">
        <button title="Confirmar seleção atual" className="btn btn-primary mt-3" onClick={() => props.onConfirmList(selectedRows)}>
          Confirmar Seleção
        </button>
        <button title="Limpar seleção atual" className="btn btn-secondary text-white mt-3" onClick={() => setSelectedRows([])}>
          Limpar Seleção
        </button>
      </div>
    </div>
  );
}