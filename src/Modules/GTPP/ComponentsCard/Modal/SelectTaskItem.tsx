import React, { useEffect, useState } from "react";
import { SelectFieldDefault } from "../../../../Components/CustomForm";
import CheckboxList from "../CheckboxList/checkboxlist";
import { Connection } from "../../../../Connection/Connection";
import { useWebSocket } from "../../Context/GtppWsContext";

interface SelectTaskItemProps {
  data?: {
    csds: { company_id: number; shop_id: number }[];
    id: number;
    setcheckTaskComShoDepSub: any;
  };
}

const SelectTaskItem: React.FC<SelectTaskItemProps> = (props) => {
  const { data } = props;

  const { checkTaskComShoDepSub } = useWebSocket();
  
  const [shopOptions, setShopOptions] = useState<{ id: number; description: string }[]>([]);
  const [companyOptions, setCompanyOptions] = useState<{ id: number; description: string }[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<{ id: number; description: string }[] | any>([]);

  const [selectedCompany, setSelectedCompany] = useState<number | undefined>(data?.csds[0]?.company_id);
  const [selectedShop, setSelectedShop] = useState<number | undefined>(data?.csds[0]?.shop_id);
  const [captureDep, setCaptureDep] = useState<number | any>();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      const connection = new Connection("18", true);
      try {
        const [companiesRes, shopsRes, departmentsRes]: any = await Promise.all([
          connection.get("", "CCPP/Company.php"),
          connection.get(`&company_id=${selectedCompany}`, "CCPP/Shop.php"),
          // @ts-ignore
          connection.get(`&company_id=${selectedCompany}&shop_id=${selectedShop}&task_id=${data.id}`, "CCPP/Department.php"),
        ]);
        setCompanyOptions(companiesRes?.data || []);
        setShopOptions(shopsRes?.data || []);
        setDepartmentOptions(departmentsRes?.data || []);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } 
    };

    fetchDepartmentData();
  }, [selectedCompany, selectedShop, data?.id]);

  // Função para fechar o modal ao clicar fora
  const handleClickOutside = (event: MouseEvent) => {
    const modal = document.getElementById("department-modal");
    if (modal && !modal.contains(event.target as Node)) {
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
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <SelectFieldDefault
            label="Companhia"
            value={selectedCompany}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSelectedCompany(Number(e.target.value))
            }
            options={companyOptions.map((company) => ({
              label: company.description,
              value: company.id,
            }))}
          />
        </div>
        <div className="col-md-4">
          <SelectFieldDefault
            label="Loja"
            value={selectedShop}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSelectedShop(Number(e.target.value))
            }
            options={shopOptions.map((shop) => ({
              label: shop.description,
              value: shop.id,
            }))}
          />
        </div>
        <div className="col-md-4">
          <div
            className="d-flex align-items-center mt-4 position-relative"
            id="department-modal"
          >
            <button
              className="btn btn-light border"
              onClick={() => setOpenModal((prev) => !prev)}
              style={{ height: "40px" }}
              aria-haspopup="true"
              aria-expanded={openModal ? "true" : "false"}
            >
              Departamento
            </button>
            {openModal && departmentOptions.length > 0 && (
              <div className="position-absolute" style={{ top: "110%" }}>
                <CheckboxList 
                  captureDep={setCaptureDep}
                  items={departmentOptions}
                  getCheck={(item: any) => {
                    // try {
                    //   const connection = new Connection("18", true);
                      // await connection.post({
                      //   task_id: props?.data?.id,
                      //   company_id: selectedCompany,
                      //   shop_id: selectedShop,
                      //   depart_id: item.id,
                    //   }, "GTPP/TaskComShoDepSub.php");
                    // } catch (error) {
                    //   console.log("teste");
                    // }

                    // @ts-ignore
                   checkTaskComShoDepSub(props.data.id, selectedCompany, selectedShop, item.id, props?.data?.id);
                    
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectTaskItem;
