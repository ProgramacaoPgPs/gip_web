import React, { useEffect, useRef, useState } from "react";
import { Connection } from "../../../../Connection/Connection";
import { useWebSocket } from "../../Context/GtppWsContext";

interface HeaderModalProps {
  color: string;
  description: string;
  taskParam?: any;
  onClick?: () => void;
}

const HeaderModal: React.FC<HeaderModalProps> = ({
  color,
  taskParam,
  description,
  onClick,
}) => {
  const [desc, setDesc] = React.useState<string | null>(description || "");
  const [habilitEditionOfText, setHabilitEditionOfText] = useState<boolean>(false);
  const titleTaskInput = useRef<HTMLInputElement>(null);
  const {getTask,task} = useWebSocket();

  React.useEffect(() => {
    setDesc(description);
  }, [description]);

  async function sendPut(newTitle: string) {
    try {
      const connection = new Connection('18');
      const req: any = await connection.put({ id: taskParam.id, priority: taskParam.priority, description: newTitle }, "GTPP/Task.php");
      if (req.error) throw new Error(req.message);
      setDesc(newTitle);
      getTask.filter(item=>item.id==task.id)[0].description = newTitle;
    } catch (error:any) {
      console.log(error)
      if(!error.message.toUpperCase().includes("NO DATA")){
        alert(error.message)
      }
    }
  }
  useEffect(() => {
    if (titleTaskInput.current) {
      if (habilitEditionOfText) {
        titleTaskInput.current.focus();
      } else {
        titleTaskInput.current.blur();
      }
    }
  }, [habilitEditionOfText]);

  return (
    <div className="w-100">
      <div className="d-flex justify-content-between align-items-center pt-2 px-2">
        <button className={`fa  p-1 me-2 btn btn-outline-${habilitEditionOfText ? "success fa-check" : "danger fa-pencil"}`} onClick={() => {
          setHabilitEditionOfText(!habilitEditionOfText);
        }
        }></button>
        <input
          ref={titleTaskInput}
          value={desc || ""}
          disabled={!habilitEditionOfText}
          onChange={(e) => setDesc(e.target.value)}
          onBlur={async (e) => {
            await sendPut(e.target.value);
          }}
          className="bg-transparent w-100 font-weight-bold"
          style={{ border: "none", fontWeight: "bold" }}
        ></input>
        <button
          onClick={onClick || (() => console.warn("Valor indefinido!"))}
          className={`btn btn-${color} text-light fa fa-x`}
          aria-label="Fechar modal"
        />
      </div>
    </div>
  );
};

export default HeaderModal;
