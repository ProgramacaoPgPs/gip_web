import { useEffect, useState } from "react";
import { FormTextAreaDefaultProps } from "./Types";
import { httpPut } from "../../../../Util/Util";

const FormTextAreaDefault: React.FC<FormTextAreaDefaultProps> = ({
  disabledForm = false,
  task_description = "",
  onChange,
  buttonTextOpen = "Aberto",
  buttonTextClosed = "Trancado",
  buttonClasses = "btn",
  textAreaClasses = "form-control",
  rows = 5,
  cols = 10,
}) => {
  const [isOpenButton, setIsOpenButton] = useState<boolean>(false);
  const [value, setValueChange] = useState<string>(task_description);

  // Atualiza o valor quando task_description mudar
  useEffect(() => {
    setValueChange(task_description);
  }, [task_description]);

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
          // if(false) {
          //   httpPut("GTPP/Task.php", {
          //     // @ts-ignore
          //     full_description: value,
          //     // @ts-ignore
          //     id: any
          //   })
          // }
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
