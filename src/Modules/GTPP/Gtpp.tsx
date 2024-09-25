import { useState, useEffect } from "react";
import { useMyContext } from "../../Context/MainContext";
import "./Gtpp.css";
import { Container, Row, Col } from "react-bootstrap";
import { Connection } from "../../Connection/Connection";
import CardTask from "./ComponentsCard/CardTask/CardTask";
import NavBar from "../../Components/NavBar";
import { listPath } from "../mock/mockTeste";
import ColumnTaskState from "./ComponentsCard/ColumnTask/columnTask";

export default function Gtpp(): JSX.Element {
  const { setTitleHead } = useMyContext();

  // Priomisse react
  const [cardTask, setCardTask] = useState<any>();
  const [cardStateTask, setCardStateTask] = useState<any>();
  const [cardTaskItem, setCardTaskItem] = useState<any>();
  const [btnValueIdTaskItem, setBtnValueIdTaskItem] = useState<any>();


  useEffect(() => {
    setTitleHead({
      title: "Gerenciador de Tarefas Peg Pese - GTPP",
      icon: "fa fa-home",
    });
  }, [setTitleHead]);

  // Aqiui estou renderizando a lista de itens de tarefas
  useEffect(() => {
    let connection = new Connection("18", true);
    async function getTaskInformations(): Promise<void> {
      try {
        let getTaskItem = await connection.get(
          `&task_id=${btnValueIdTaskItem}`,
          "GTPP/TaskItem.php"
        );
        setCardTaskItem(getTaskItem);
      } catch (error) {
        console.error("Erro ao obter as informações da tarefa:", error);
      }
    }

    getTaskInformations();
  }, [btnValueIdTaskItem]);

  // useEffect(() => {
  //   let connection = new Connection("3", true);
  //   async function getTaskStateColumns(): Promise<void> {
  //     try {
  //       let getTaskStateColumn = await connection.get('', 'GTPP/TaskState.php');
  //       setColumnTask(getTaskStateColumn);
  //     } catch (error) {
  //       console.error("Erro ao obter as informações: ", error);
  //     }
  //   }

  //   getTaskStateColumns();
  // }, []);

  // Aqui estou renderizando as tarefas e seus status.
  useEffect(() => {
    let connection = new Connection("18", true);
    async function getTaskInformations(): Promise<void> {
      try {
        let getTask = await connection.get("", "GTPP/Task.php");
        let getStatusTask = await connection.get("", "GTPP/TaskState.php");

        setCardTask(getTask);
        setCardStateTask(getStatusTask);
      } catch (error) {
        console.error("Erro ao obter as informações da tarefa:", error);
      }
    }

    getTaskInformations();
  }, []);

  console.log();

  return (
    <div id="moduleGTPP" className="h-100 w-100">
      <Container fluid className="h-100">
        <Row className="h-100">
          {/* <Col xs={12} md={12} className="menu-gtpp">
            <header id="headerGipp" className="menu-link">
              <NavBar list={listPath} />
            </header>
          </Col> */}
          <Col xs={12} md={12} className="menu-task pt-3">
            <div className="tasks-container mt-3">
              <div className="d-flex gap-5 overflow-auto">
                <div className="d-flex gap-3 justify-content-between w-100">
                  {/* {cardStateTask.data.map((cardTaskStateValue: any , idxValueState: any) => {
                    return (
                      <ColumnTaskState bgColor={cardTaskStateValue.color} title={cardTaskStateValue.description} />
                    )
                  })} */}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
