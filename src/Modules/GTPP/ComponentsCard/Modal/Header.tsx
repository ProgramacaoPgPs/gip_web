import React from "react";
import { Connection } from "../../../../Connection/Connection";

interface HeaderModalProps {
  color: string;
  description: string;
  task?: any;
  onClick?: () => void;
}

const HeaderModal: React.FC<HeaderModalProps> = ({
  color,
  task,
  description,
  onClick,
}) => {
  const [desc, setDesc] = React.useState<string | null>(description || "");

  React.useEffect(() => {
    setDesc(description);
  }, [description]);

  async function sendPut(newTitle: string) {
    try {
      if (newTitle == description) throw new Error("Não houve mudança");
      const connection = new Connection('18');
      const req: any = await connection.put({ id: task.id, priority: task.priority, description: newTitle }, "GTPP/Task.php");
      if (req.error) throw new Error(req.data);
      setDesc(newTitle);
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div className="w-100">
      <div className="d-flex justify-content-between align-items-center pt-2 px-2">
        <input
          value={desc || ""}
          onChange={(e) => setDesc(e.target.value)}
          onBlur={async (e) => {
            await sendPut(e.target.value);
          }}
          // onKeyDown={async (e) => { const title = e.target as HTMLInputElement; await sendPut(title.value) }}
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
