import { useEffect, useRef } from "react";
import CustomForm from "../../../../Components/CustomForm";
import { fieldsetsRegister } from "../../mock/mockTeste";
import { useConnection } from "../../../../Context/ConnContext";

type Cardregister = {
  assistenceFunction?: any;
  reloadtask?: any;
  setReset?: any;
  onClose:()=>void;
};

const Cardregister: React.FC<Cardregister> = (props) => {
  const { assistenceFunction } = props;

  const {fetchData} = useConnection();

  const formDataRef = useRef({
    description: "",
    initial_date: "",
    final_date: "",
    priority: "1",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    formDataRef.current = {
      ...formDataRef.current,
      [name]: value,
    };
  };

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const response: any = await fetchData({method:"POST",params:formDataRef.current,pathFile:"GTPP/Task.php"})
      if (response.error) throw new Error(response.message);
      props.reloadtask();
      props.onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card bodyCard">
      <div className="d-flex justify-content-end align-items-center">
        <div>
          <button
            className="btn fa fa-close m-4"
            onClick={assistenceFunction}
          ></button>
        </div>
      </div>
      <CustomForm
        fieldsets={fieldsetsRegister}
        onSubmit={handleSubmit}
        onChange={(event) => handleChange(event)}
        titleButton={"Enviar"}
        method="post"
        className='p-3'
        id='loginCustomForm'
      />
    </div>
  );
};

export default Cardregister;
