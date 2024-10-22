import React, { useState, useEffect } from "react";
import { useMyContext } from "../../Context/MainContext";
import "./Gtpp.css";
import { Container, Row, Col } from "react-bootstrap";
import { Connection } from "../../Connection/Connection";
import CardTask from "./ComponentsCard/CardTask/CardTask";
import NavBar from "../../Components/NavBar";
import { listPath } from "./mock/mockTeste";
import ColumnTaskState from "./ComponentsCard/ColumnTask/columnTask";
import { PDFGenerator, generateAndDownloadCSV } from "../../Class/FileGenerator";
import useWebSocketGTPP from '../GTPP/hook/WebSocketHook';
import Cardregister from "./ComponentsCard/CardRegister/Cardregister";
import ModalDefault from "./ComponentsCard/Modal/Modal";

export default function Gtpp(): JSX.Element {
  const { setTitleHead, setModalPage, setModalPageElement } = useMyContext();
  const [cardTask, setCardTask] = useState<any>();
  const [cardStateTask, setCardStateTask] = useState<any>();
  const { isConnected, responseWebSocket } = useWebSocketGTPP();
  const [openFilter, setOpenFilter] = useState<any>(false);
  const [reset, setReset] = useState<any>(0);
  const [getTaskId, setTaskId] = useState<any>('');
  const [Item, getAllTaskItem] = useState<any>({});
  const [openCardDefault, setOpenCardDefault] = useState<any>(false);
  const [filterTask, setFilterTask] = useState<any>([]);

  useEffect(() => {
    setTitleHead({
      title: "Gerenciador de Tarefas Peg Pese - GTPP",
      icon: "fa fa-home",
    });
  }, [setTitleHead]);

  useEffect(() => {
    const connection = new Connection("18", true);
    async function getTaskInformations(): Promise<void> {
      if (!getTaskId) return; // Evita chamadas desnecessárias se o ID não estiver definido
      try {
        // const getTaskItem = await connection.get(`&task_id=${getTaskId.toString()}`, "GTPP/TaskItem.php");
        const getTaskItem = await connection.get(`&id=${getTaskId.toString()}`, "GTPP/Task.php");
        getAllTaskItem(getTaskItem);
      } catch (error) {
        console.error("Erro ao obter as informações da tarefa:", error);
      }
    }
    getTaskInformations();
  }, [getTaskId, reset]);

  useEffect(() => {
    const connection = new Connection("18", true);
    async function getTaskInformations(): Promise<void> {
      try {
        const getTask = await connection.get("", "GTPP/Task.php");
        // const getIdTask = await connection.get("&id=", "GTPP/Task.php");
        // console.log(getIdTask);
        const getStatusTask = await connection.get("", "GTPP/TaskState.php");

        setCardTask(getTask);
        setCardStateTask(getStatusTask);
      } catch (error) {
        console.error("Erro ao obter as informações da tarefa:", error);
      }
    }
    getTaskInformations();
  }, [reset, responseWebSocket]);

  const [selectedStateIds, setSelectedStateIds] = useState<number[]>([]);

  const handleCheckboxChange = (stateId: number) => {
    setSelectedStateIds((prevSelectedStateIds: number[]) => {
      if (prevSelectedStateIds.includes(stateId)) {
        return prevSelectedStateIds.filter((id) => id !== stateId);
      } else {
        return [...prevSelectedStateIds, stateId];
      }
    });
  };

  const handleOpenFilter = (e: any) => {
    setOpenFilter((prevOpen: any) => !prevOpen);
  };

  return (
    <div id="moduleGTPP" className="h-100 w-100 position-relative">
      {false ? <h1>Status da conexão: {isConnected ? "Conectado" : "Desconectado"}</h1> : null}
      <Container fluid className={`h-100 d-flex`}>
        <Row className="flex-grow-0">
          <Col xs={12}>
            <header id="headerGipp" className="menu-link">
              <NavBar list={listPath} />
            </header>
          </Col>
        </Row>
        <Row className="flex-grow-1 overflow-hidden">
          <Col xs={12} className="position-relative" style={{ padding: 0, marginLeft: 15 }}>
            <h1 onClick={handleOpenFilter} className="cursor-pointer mt-3">Filtros <i className="fa fa-angle-down"></i></h1>
            <div className="position-absolute" style={{ zIndex: 1 }}>
              {openFilter ? (
                <div className="bg-light border-dark p-3">
                  {cardStateTask?.data.map(
                    (cardTaskStateValue: any, idxValueState: any) => (
                      <div key={idxValueState}>
                        <label className="cursor-pointer">
                          <input type="checkbox" onChange={() => handleCheckboxChange(cardTaskStateValue.id)} checked={selectedStateIds.includes(cardTaskStateValue.id)} />{" "}
                          {cardTaskStateValue.description}
                        </label>
                      </div>
                    )
                  )}
                </div>
              ) : null}
            </div>
          </Col>
          <Col xs={12} className="d-flex flex-nowrap p-0" style={{ overflowX: 'auto' }}>
            {cardStateTask?.data.map(
              (cardTaskStateValue: any, idxValueState: any) => {
                const filteredTasks = cardTask?.data.filter(
                  (task: any) => task.state_id === cardTaskStateValue.id
                );

                const isFirstColumnTaskState = idxValueState === 0;

                const isHidden = selectedStateIds.includes(
                  cardTaskStateValue.id
                );

                return (
                  !isHidden && (
                    <div
                      key={idxValueState}
                      className="column-task-container p-2 flex-shrink-0"
                    >
                      <ColumnTaskState
                        title={cardTaskStateValue.description}
                        bg_color={cardTaskStateValue.color}
                        is_first_column={isFirstColumnTaskState}
                        addTask={() => {
                          setModalPageElement(<Cardregister assistenceFunction={() => setModalPage(false)} setReset={setReset} />);
                          setModalPage(true);
                        }}
                        exportCsv={() => {
                          generateAndDownloadCSV(
                            filteredTasks,
                            "teste",
                            "GTPP-documento"
                          );
                        }}
                        exportPdf={() => {
                          setModalPageElement(
                            <div className="card w-75 position relative">
                              <div className="d-flex justify-content-end align-items-center">
                                <div className="">
                                  <button className="btn fa fa-close m-4" onClick={() => setModalPage(false)}></button>
                                </div>
                              </div>
                              <div className="overflow-auto h-75">
                                <div className="m-3">
                                  <PDFGenerator data={filteredTasks} />
                                </div>
                              </div>
                            </div>
                          );
                          setModalPage(true);
                        }}
                        content_body={
                          <div className="task-cards-container">
                            {filteredTasks?.map((task: any, idx: number) => {
                              return (
                                <CardTask
                                  key={idx}
                                  initial_date={task.initial_date}
                                  final_date={task.final_date}
                                  title_card={task.description}
                                  priority_card={task.priority}
                                  onClick={() => {
                                    setFilterTask(task);
                                    setTaskId(task.id); // Atualiza o taskId
                                    setOpenCardDefault(true); // Abre o modal
                                  }}
                                />
                              );
                            })}
                          </div>
                        }
                      />
                    </div>
                  )
                );
              }
            )}
          </Col>
        </Row>
        {openCardDefault && <ModalDefault listItem={Item} taskFilter={filterTask} close_modal={() => {
          setReset((prev: any) => prev + 1);
          setOpenCardDefault(false);
        }} />}
      </Container>
    </div>
  );
}
