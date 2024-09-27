import { useState, useEffect } from "react";
import { useMyContext } from "../../Context/MainContext";
import "./Gtpp.css";
import { Container, Row, Col } from "react-bootstrap";
import { Connection } from "../../Connection/Connection";
import CardTask from "./ComponentsCard/CardTask/CardTask";
import NavBar from "../../Components/NavBar";
import { listPath } from "../mock/mockTeste";
import ColumnTaskState from "./ComponentsCard/ColumnTask/columnTask";
import StructureModal from "../../Components/CustomModal";
import Hamburger from "./ComponentsCard/Button/Hamburger/hamburger";

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
  const { setTitleHead, setModalPage, setModalPageElement } = useMyContext();
  const [cardTask, setCardTask] = useState<any>();
  const [cardStateTask, setCardStateTask] = useState<any>();
  const [cardTaskItem, setCardTaskItem] = useState<any>();
  const [idButton, setIdButton] = useState<any>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [btnValueIdTaskItem, setBtnValueIdTaskItem] = useState<any>();
  const isLandscape = useWindowSize();

  useEffect(() => {
    
    setTitleHead({
      title: "Gerenciador de Tarefas Peg Pese - GTPP",
      icon: "fa fa-home",
    });
  }, [setTitleHead, setModalPage, setModalPageElement]);

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

  return (
    <div id="moduleGTPP" className="h-100 w-100 position-relative">
      {!true ? (
        <StructureModal
          className="StructureModal ModalBgBlack z-index-modal"
          children={
            <div className="card w-75 h-75">
              <div className="col-12 bg-primary header-menu">t</div>
              <div className="d-flex overflow-hidden h-100">
                <div className="col-7 h-100 bg-danger">t</div>
                <div className="col-5 bg-warning">t</div>
              </div>
            </div>
          }
        />
      ) : null}
      <Container
        fluid
        className={`h-100 d-flex ${isLandscape ? "flex-row" : "flex-column"} `}
      >
        <Row className="flex-grow-0">
          <Col xs={12}>
            <header id="headerGipp" className="menu-link">
              <NavBar list={listPath} />
            </header>
          </Col>
        </Row>
        <Row className="flex-grow-1 overflow-hidden">
          {/* <div className="h-100 bg-dark position-absolute" style={{opacity: 0.5, width: '91%'}}></div> */}
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
                      
                      onAction={() => {
                        setModalPageElement(
                          <div className="card position-absolute w-25 h-25" style={{left: '1px', top: '1px'}}>
                            t <button className="btn btn-primary m-4" onClick={()=> setModalPage(false)}>close</button>
                          </div>
                        );
                        setModalPage(true);
                      }}
                      // buttonHeader={<Hamburger />}
                      contentBody={
                        <div className="task-cards-container">
                          {filteredTasks?.map((task: any, idx: number) => (
                            <CardTask
                              key={idx}
                              initial_date={task.initial_date}
                              final_date={task.final_date}
                              titleCard={task.description}
                              priorityCard={task.priority}
                              onClick={() => {
                                // Estamos capturando o Id da tarefa para abrir o modal.
                                setIdButton(task.id);
                                setModalPageElement(
                                  <div className="card w-75 h-75">
                                    <div className="col-12 bg-primary header-menu">t</div>
                                    <div className="d-flex overflow-hidden h-100">
                                      <div className="col-7 h-100 bg-danger">
                                        <button className="btn btn-primary m-4" onClick={()=>setModalPage(false)}>close</button>
                                      </div>
                                      <div className="col-5 bg-warning">t</div>
                                    </div>
                                  </div>
                                );
                                setModalPage(true);
                              }}
                            />
                          ))}
                        </div>
                      }
                      />
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
