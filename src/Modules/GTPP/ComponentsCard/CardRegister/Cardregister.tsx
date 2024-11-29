import { useEffect, useRef } from "react";
import { Connection } from "../../../../Connection/Connection";
import CustomForm from "../../../../Components/CustomForm";
import { fieldsetsRegister } from "../../mock/mockTeste";

type Cardregister = {
  assistenceFunction?: any;
  setReset?: any;
};

const Cardregister: React.FC<Cardregister> = (props) => {
  const { assistenceFunction, setReset } = props;

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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const connection = new Connection("18", true);
    connection.post(formDataRef.current, "GTPP/Task.php");
    // setReset((prev: any) => prev + 1);
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
         onChange={(event)=>handleChange(event)}
         titleButton={"Enviar"}
         method="post"
         className='p-3'
         id='loginCustomForm'
      />
    </div>
  );
};

export default Cardregister;
