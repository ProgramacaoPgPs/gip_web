import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useMyContext } from "../../Context/MainContext";
import "./Gtpp.css";
import { Container, Row, Col } from "react-bootstrap";
import { Connection } from "../../Connection/Connection";
import CardTask from "./ComponentsCard/CardTask/CardTask";
import NavBar from "../../Components/NavBar";
import { listPath } from "./mock/mockTeste";
import ColumnTaskState from "./ComponentsCard/ColumnTask/columnTask";
import { PDFGenerator, generateAndDownloadCSV } from "../../Class/FileGenerator";
import Cardregister from "./ComponentsCard/CardRegister/Cardregister";
import ModalDefault from "./ComponentsCard/Modal/Modal";
import { useWebSocket } from "./Context/GtppWsContext";

export default function Gtpp(): JSX.Element {
  const { setTitleHead, setModalPage, setModalPageElement /*,webSocketInstance*/ } = useMyContext();
  
  const [cardTask, setCardTask] = useState<any>();
  const [cardStateTask, setCardStateTask] = useState<any>();

  const [openFilter, setOpenFilter] = useState<any>(false);

  const [openCardDefault, setOpenCardDefault] = useState<any>(false);
  // const [filterTask, setFilterTask] = useState<any>([]);
  const [responseWs, setResponseWs] = useState<any>([]);
  const [renderList, setRenderList] = useState<any>(true);
  const [loading, setLoading] = useState<any>(false);

  // Modified by Hygor
  const {task,setTask,setTaskPercent,clearGtppWsContext} = useWebSocket();

  useEffect(() => {
    setTitleHead({
      title: "Gerenciador de Tarefas Peg Pese - GTPP",
      icon: "fa fa-home",
    });
  }, [setTitleHead]);


  // setTimeout(() => {
  //   const responseData = webSocketInstance?.getLastSentMessage();
  //   setResponseWs(responseData);
  // }, 1);

  const connection = useMemo(() => new Connection("18", true), []);

  useEffect(() => {
    setLoading(true);
    async function getTaskInformations(): Promise<void> {
      try {
        const getStatusTask = await connection.get("", "GTPP/TaskState.php");
        setCardStateTask(getStatusTask);
      } catch (error) {
        console.error("Erro ao obter as informações da tarefa:", error);
      }
    }
    getTaskInformations();
    setLoading(false);
  }, [connection]);

  const getTaskInformations = useCallback(async () => {
    const connection = new Connection("18", true);
    try {
      const getTask = await connection.get("", "GTPP/Task.php");
      setCardTask(getTask);      
    } catch (error) {
      console.error("Erro ao obter as informações da tarefa:", error);
    }
  }, [])

  useEffect(() => {
    getTaskInformations();
  }, [getTaskInformations, renderList]);

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

  if(loading) return (<React.Fragment>Carregando...</React.Fragment>);

  return (
    <div id="moduleGTPP" className="h-100 w-100 position-relative">
      <Container fluid className={`h-100 d-flex`}>
        <Row className="flex-grow-0">
          <Col xs={12}>
            <header id="headerGipp" className="menu-link">
              <NavBar list={listPath} />
            </header>
          </Col>
        </Row>
        <div className="flex-grow-1 d-flex flex-column justify-content-between align-items-start h-100 overflow-hidden">
          <div className="position-relative" style={{ padding: 0, marginLeft: 15 }}>
            <h1 onClick={handleOpenFilter} className="cursor-pointer mt-3">Filtros <i className="fa fa-angle-down"></i></h1>
            <div className="position-absolute filter-modal">
              {openFilter ? (
                <div className="bg-light border-dark p-3">
                  {cardStateTask?.data.map(
                    (cardTaskStateValue: any, idxValueState: any) => (
                      <div key={idxValueState}>
                        <label className="cursor-pointer">
                          <input type="checkbox" onChange={() => handleCheckboxChange(cardTaskStateValue.id)} checked={!selectedStateIds.includes(cardTaskStateValue.id)} />{" "}
                          {cardTaskStateValue.description}
                        </label>
                      </div>
                    )
                  )}
                </div>
              ) : null}
            </div>
          </div>
          <Col xs={12} className="d-flex h-100 flex-nowrap p-0" style={{ overflowX: 'auto' }}>
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
                      className="column-task-container p-2 align-items-start flex-shrink-0"
                    >
                      <ColumnTaskState
                        title={cardTaskStateValue.description}
                        bg_color={cardTaskStateValue.color}
                        is_first_column={isFirstColumnTaskState}
                        addTask={() => {
                          setModalPageElement(<Cardregister assistenceFunction={() => setModalPage(false)} />);
                          setModalPage(true);
                        }}
                        exportCsv={() => {
                          generateAndDownloadCSV(filteredTasks,"teste","GTPP-documento");
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
                                    setTask(task);
                                    setTaskPercent(task.percent);
                                    setOpenCardDefault(true);
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
        </div>
        {/* 
          A renderização do componente tem que ser aqui
          a porcentagem chegando a 0 ele tem que renderizar o componente
        */}
        {openCardDefault && <ModalDefault setRenderList={setRenderList}  taskFilter={task} close_modal={() => { setOpenCardDefault(false); clearGtppWsContext()}} />}
      </Container>
    </div>
  );
}
