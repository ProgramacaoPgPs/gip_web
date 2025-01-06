import React from "react";
import { Connection } from "../../../../Connection/Connection";

interface HeaderModalProps {
  color: string;
  description: string;
  task_id?: number;
  onClick?: () => void;
}

const HeaderModal: React.FC<HeaderModalProps> = ({
  color,
  task_id,
  description,
  onClick,
}) => {
  const [desc, setDesc] = React.useState<string | null>(description || "");

  React.useEffect(() => {
    setDesc(description);
  }, [description]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      sendPut();

    }
  };

  async function sendPut() { 
    try {
      const connection = new Connection('18');
      await connection.put({task_id: task_id, description: description}, "GTPP/Task.php");
    } catch (error) {
      alert('error ao mudar a descrição da tarefa');
    }
  }

  return (
    <div className="w-100">
      <div className="d-flex justify-content-between align-items-center pt-2 px-2">
        <input
          value={desc || ""}
          onChange={(e) => setDesc(e.target.value)}
          onBlur={(e) => {
            setDesc(e.target.value);
            sendPut();
          }}
          onKeyDown={handleKeyDown}
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
