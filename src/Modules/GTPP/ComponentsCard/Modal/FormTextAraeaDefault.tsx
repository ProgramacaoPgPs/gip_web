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
  task, details
}) => {
  const [isOpenButton, setIsOpenButton] = useState<boolean>(false);
  const [value, setValueChange] = useState<string>(details?.full_description);

  const {changeDescription} = useWebSocket();

  // Atualiza o valor quando task_description mudar
  useEffect(() => {
    setValueChange(details?.full_description);
    console.log(details?.full_description);
  }, [details?.full_description]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValueChange(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <div className="d-flex align-items-end gap-2 mt-2 flex-column">
      <textarea
        style={{ resize: "none" }}
        onChange={handleTextChange}
        disabled={disabledForm || !isOpenButton}
        value={value}
        className={textAreaClasses}
        cols={cols}
        rows={rows}
        aria-label="Descrição da tarefa"
      />
      <button
        onClick={() => {
          changeDescription(value, task.id, task.id);
          setIsOpenButton((prev) => !prev);
        }}
        className={`${buttonClasses} btn-${isOpenButton ? "success" : "danger"}`}
        aria-label={isOpenButton ? buttonTextOpen : buttonTextClosed}
      >
        {isOpenButton ? buttonTextOpen : buttonTextClosed}
      </button>
    </div>
  );
};

export default FormTextAreaDefault;
