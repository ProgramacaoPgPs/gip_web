import React, { useEffect, useRef, useState } from "react";
import { Connection } from "../../../../Connection/Connection";
import { useWebSocket } from "../../Context/GtppWsContext";
import { InputCheckButton } from "../../../../Components/CustomButton";
import CardUser from "../../../CLPP/Components/CardUser";
import User from "../../../../Class/User";
import { convertdate } from "../../../../Util/Util";
import { useMyContext } from "../../../../Context/MainContext";
import { useConnection } from "../../../../Context/ConnContext";

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
  const [detailUser, setDetailUser] = useState<boolean>(false);
  const [detailTask, setDetailTask] = useState<boolean>(false);
  const [userTask, setUserTask] = useState<User>();
  const titleTaskInput = useRef<HTMLInputElement>(null);
  const { getTask, task } = useWebSocket();
  const { setLoading } = useMyContext();
  const {fetchData} = useConnection();

  React.useEffect(() => {
    setDesc(description);
  }, [description]);

  async function sendPut(newTitle: string) {
    try {
      const req: any = await fetchData({method:"PUT",params:{ id: taskParam.id, priority: taskParam.priority, description: newTitle }, pathFile:"GTPP/Task.php"})
      if (req.error) throw new Error(req.message);
      setDesc(newTitle);
      getTask.filter(item => item.id == task.id)[0].description = newTitle;
    } catch (error: any) {
      console.error(error.message)
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
  function DetailsTask() {
    return (
      <div className="d-flex flex-column h-100 border p-2 my-2 rounded cardContact">
        <span className="d-flex justify-content-between">
          <strong>Data inicial:</strong>
          <div>{convertdate(task.initial_date)}</div>
        </span>
        <span className="d-flex justify-content-between">
          <strong>Data Final:</strong>
          <div>{convertdate(task.final_date)}</div>
        </span>
        <span className="d-flex justify-content-between">
          <strong>Status:</strong>
          <div>{task.state_description}</div>
        </span>
      </div>
    );
  }

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
        <div className="d-flex gap-2">
          <InputCheckButton inputId={`task_details_user_${task.user_id}`} onAction={async (e: boolean) => {
            try {
              setLoading(true);        
              if (e && !userTask) {
                const user = new User({ id: task.user_id });
                await user.loadInfo(true);
                setUserTask(user);
              } else {
                setUserTask(undefined);
              }
            } catch (error) {
              console.error(error);
            }finally{
              setDetailUser(e);
              setLoading(false);
            }
          }} labelIconConditional={["fa-solid fa-chevron-down", "fa-solid fa-chevron-up"]} />
          <InputCheckButton inputId={`task_details_${task.user_id}`} onAction={async (e: boolean) => {
            setDetailTask(e);            
          }} labelIcon={"fa-solid fa-circle-info"} highlight={true}/>

          <button
            onClick={onClick || (() => console.warn("Valor indefinido!"))}
            className={`btn btn-${color} text-light fa fa-x`}
            aria-label="Fechar modal"
          />
        </div>
      </div>
      { detailUser ?  <CardUser {...userTask} name={userTask?.name} /> : <React.Fragment />}
      { detailTask ?  <DetailsTask /> : <React.Fragment />}
    </div>
  );
};

export default HeaderModal;
