import { useEffect, useState } from "react";
import { FormTextAreaDefaultProps } from "./Types";
import { httpPut } from "../../../../Util/Util";
import { useWebSocket } from "../../Context/GtppWsContext";

const FormTextAreaDefault: React.FC<FormTextAreaDefaultProps> = ({
  disabledForm = false,
  onChange,
  buttonTextOpen = "Aberto",
  buttonTextClosed = "Trancado",
  buttonClasses = "btn",
  textAreaClasses = "form-control",
  rows = 5,
  cols = 10,
  task,
  details
}) => {
  const [isOpenButton, setIsOpenButton] = useState<boolean>(false);
  const [value, setValueChange] = useState<string>(details?.full_description);
  const {changeDescription} = useWebSocket();

  useEffect(() => {
    setValueChange(details?.full_description);
  }, [details?.full_description]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValueChange(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <div className="d-flex align-items-end gap-2 mt-2 flex-column position-relative">
      <textarea
        style={{ resize: "none" }}
        onChange={handleTextChange}
        disabled={disabledForm || !isOpenButton}
        value={value}
        className={`${textAreaClasses}`}
        cols={cols}
        rows={rows}
        aria-label="Descrição da tarefa"
      />
      <button
        onClick={() => {
          changeDescription(value, task.id, task.id);
          setIsOpenButton((prev) => !prev);
        }}
        className={`${buttonClasses}  position-absolute`} 
        style={{
          top: "82px",
        }}
        aria-label={isOpenButton ? buttonTextOpen : buttonTextClosed}
      >
        <i className={`fa fa-${isOpenButton ? "unlock" : "lock" } text-${isOpenButton ? "success" : "danger"}`}></i>
      </button>
    </div>
  );
};

export default FormTextAreaDefault;
