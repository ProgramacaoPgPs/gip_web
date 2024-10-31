import React, { useEffect, useState } from "react";
import { SelectFieldDefault } from "../../../../Components/CustomForm";
import CheckboxList from "../CheckboxList/checkboxlist";
import { Connection } from "../../../../Connection/Connection";

interface SelectTaskItemProps {
  data?: {
    csds: { company_id: number, shop_id: number }[];
    id: number;
  };
}

const SelectTaskItem: React.FC<SelectTaskItemProps> = ({ data }) => {
  const connection = new Connection("18", true);

  const [shopOptions, setShopOptions] = useState<{ id: number, description: string }[]>([]);
  const [companyOptions, setCompanyOptions] = useState<{ id: number, description: string }[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<{ id: number, description: string }[]>([]);

  const [selectedCompany, setSelectedCompany] = useState<number | undefined>(data?.csds[0]?.company_id);
  const [selectedShop, setSelectedShop] = useState<number | undefined>(data?.csds[0]?.shop_id);

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const [departmentsRes, shopsRes, companiesRes]: any = await Promise.all([
          connection.get(`&company_id=${selectedCompany}&shop_id=${selectedShop}&task_id=${data?.id}`, "CCPP/Department.php"),
          connection.get(`&company_id=${selectedCompany}`, "CCPP/Shop.php"),
          connection.get("", "CCPP/Company.php"),
        ]);

        setCompanyOptions(companiesRes.data);
        setShopOptions(shopsRes.data || []);
        setDepartmentOptions(departmentsRes.data || []);

      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchDepartmentData();
  }, [selectedCompany, selectedShop, data?.id]);

  const handleClickOutside = (event: MouseEvent) => {
    if (!document.getElementById("department-modal")?.contains(event.target as Node)) {
      setOpenModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-around mt-2 position-relative">
          <SelectFieldDefault
            label="Companhia"
            value={selectedCompany}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCompany(Number(e.target.value))}
            options={companyOptions.map((company) => ({ label: company.description, value: company.id }))}
          />

          <SelectFieldDefault
            label="Loja"
            value={selectedShop}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedShop(Number(e.target.value))}
            options={shopOptions.length > 0 ? shopOptions.map((shop) => ({ label: shop.description, value: shop.id })) : []}
          />

          <div className="d-flex align-items-center mt-4 position-relative" id="department-modal">
            <button
              className="btn btn-light border"
              onClick={() => setOpenModal((prev) => !prev)}
              style={{ height: "40px" }}
              aria-haspopup="true"
              aria-expanded={openModal}
            >
              Departamento
            </button>
            {openModal && (
              <div className="position-absolute" style={{ top: "100%" }}>
                {departmentOptions.length > 0 && <CheckboxList items={departmentOptions} />}
              </div>
            )}
          </div>
    </div>
  );
};

export default SelectTaskItem;
