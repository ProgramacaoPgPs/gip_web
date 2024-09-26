import { useState, useEffect } from "react";
import { useMyContext } from "../../Context/MainContext";
import "./Gtpp.css";
import { Container, Row, Col } from "react-bootstrap";
import { Connection } from "../../Connection/Connection";
import CardTask from "./ComponentsCard/CardTask/CardTask";
import NavBar from "../../Components/NavBar";
import { listPath } from "../mock/mockTeste";
import ColumnTaskState from "./ComponentsCard/ColumnTask/columnTask";

// Hook para observar as mudanças de tamanho da janela
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isLandscape = windowSize.width > windowSize.height;
  return isLandscape;
}

export default function Gtpp(): JSX.Element {
  const { setTitleHead } = useMyContext();

  const [cardTask, setCardTask] = useState<any>();
  const [cardStateTask, setCardStateTask] = useState<any>();
  const [cardTaskItem, setCardTaskItem] = useState<any>();
  const [btnValueIdTaskItem, setBtnValueIdTaskItem] = useState<any>();
  const [isVisible, setIsVisible] = useState<any>(false);
  const [idButton, setIdButton] = useState<number>(0);
  const isLandscape = useWindowSize();

  useEffect(() => {
    setTitleHead({
      title: "Gerenciador de Tarefas Peg Pese - GTPP",
      icon: "fa fa-home",
    });
  }, [setTitleHead]);

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
  

  const handleClick = (id:number) => {
    setIsVisible((prev: any) => !prev);
    setIdButton(id === idButton ? 0 : id);    
  };

  return (
    <div id="moduleGTPP" className="h-100 w-100">
      <Container
        fluid
        className={`h-100 d-flex ${isLandscape ? "flex-row" : "flex-column"}`}
      >
        <Row className="flex-grow-0">
          <Col xs={12}>
            <header id="headerGipp" className="menu-link">
              <NavBar list={listPath} />
            </header>
          </Col>
        </Row>
        <Row className="flex-grow-1 overflow-hidden position-relative">
          {/* modelo quando */}
          {isVisible ? (
            <div
              className="bg-dark h-100 w-100 position-absolute menu-card-outside"
              onClick={(e) => {
                handleClick(0);
              }}
            ></div>
          ) : null}
          <Col xs={12} className="d-flex flex-nowrap overflow-auto p-0">
            {cardStateTask?.data.map(
              (cardTaskStateValue: any, idxValueState: any) => {
                const filteredTasks = cardTask?.data.filter(
                  (task: any) => task.state_id === cardTaskStateValue.id
                );

                return (
                  <div
                    key={idxValueState}
                    className="column-task-container p-2 flex-shrink-0"
                  >
                    <ColumnTaskState
                      title={cardTaskStateValue.description}
                      bgColor={cardTaskStateValue.color}
                    >
                      <div className="task-cards-container">
                        {filteredTasks?.map((task: any, idx: number) => {
                          return (
                            <CardTask
                              key={idx}
                              styleClass={
                                task.id == idButton
                                  ? "z-index-outside-with-menu"
                                  : ""
                              }
                              assistantFunction={() => {
                                handleClick(task.id);                          
                              }}
                              initial_date={task.initial_date}
                              final_date={task.final_date}
                              titleCard={task.description}
                              priorityCard={task.priority}
                            />
                          );
                        })}
                      </div>
                    </ColumnTaskState>
                  </div>
                );
              }
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
