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
import NotificationBell from "../../Components/NotificationBell";

export default function Gtpp(): JSX.Element {
  const { setTitleHead, setModalPage, setModalPageElement } = useMyContext();
  const [cardTask, setCardTask] = useState<any>();
  const [cardStateTask, setCardStateTask] = useState<any>();
  const [openFilter, setOpenFilter] = useState<any>(false);
  const [openCardDefault, setOpenCardDefault] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);

  // Modified by Hygor
  const { setTask, setTaskPercent, clearGtppWsContext, setOnSounds, updateStates, taskDetails, states, onSounds, task, } = useWebSocket();
  useEffect(() => {
    setTitleHead({
      title: "Gerenciador de Tarefas Peg Pese - GTPP",
      icon: "fa fa-home",
    });
  }, [setTitleHead]);



  function handleCheckboxChange(stateId: number) {
    const newItem: any = [...states];
    newItem[newItem.findIndex((item: any) => item.id == stateId)].active = !newItem[newItem.findIndex((item: any) => item.id == stateId)].active;
    updateStates(newItem);
  };


  //ALTERADO POR HYGOR FIM

  const getTaskInformations = useCallback(async () => {
    const connection = new Connection("18", true);
    try {
      const getTask = await connection.get("", "GTPP/Task.php");
      setCardTask(getTask);
    } catch (error) {
      console.error("Erro ao obter as informações da tarefa:", error);
    }
  }, [task]);

  useEffect(() => {
    getTaskInformations();
  }, [getTaskInformations]);


  const handleOpenFilter = (e: any) => {
    setOpenFilter((prevOpen: any) => !prevOpen);
  };

  if (loading) return (<React.Fragment>Carregando...</React.Fragment>);


  return (
    <div id="moduleGTPP" className="d-flex h-100 w-100 position-relative">
      <NavBar list={listPath} />
      <Container className={`h-100 d-flex`}>
        <div className="flex-grow-1 d-flex flex-column justify-content-between align-items-start h-100 overflow-hidden">
          <div className="d-flex w-100 align-items-center justify-content-between my-2 py-2">

            <div className="position-relative">
              <h1 onClick={handleOpenFilter} className="cursor-pointer">Filtros <i className="fa fa-angle-down"></i></h1>
              <div className="position-absolute filter-modal">
                {openFilter ? (
                  <div className="bg-light border-dark p-3">
                    {states?.map(
                      (cardTaskStateValue: any, idxValueState: any) => (
                        <div key={idxValueState}>
                          <label className="cursor-pointer">
                            <input type="checkbox" onChange={() => handleCheckboxChange(cardTaskStateValue.id)} checked={cardTaskStateValue.active} />
                            {cardTaskStateValue.description}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="d-flex flex-row w-50 justify-content-end">
              <div className="mx-2 cursor-pointer" onClick={() => { setOnSounds(!onSounds) }}>
                {onSounds ? <i className="fa-solid fa-volume-high"></i> : <i className="fa-solid fa-volume-xmark"></i>}
              </div>
              <div className="mx-2">
                <NotificationBell />
              </div>
            </div>

          </div>
          <Col xs={12} className="d-flex flex-nowrap p-0" style={{ overflowX: 'auto', height: '91%' }}>
            {states?.map(
              (cardTaskStateValue: any, idxValueState: any) => {
                const filteredTasks = cardTask?.data.filter(
                  (task: any) => task.state_id === cardTaskStateValue.id
                );

                const isFirstColumnTaskState = idxValueState === 0;

                return (
                  cardTaskStateValue.active && (
                    <div
                      key={idxValueState}
                      className="column-task-container p-2 align-items-start flex-shrink-0"
                    >
                      <ColumnTaskState
                        title={cardTaskStateValue.description}
                        bg_color={cardTaskStateValue.color}
                        is_first_column={isFirstColumnTaskState}
                        addTask={() => {
                          setModalPageElement(<Cardregister reloadtask={getTaskInformations} assistenceFunction={() => setModalPage(false)} />);
                          setModalPage(true);
                        }}
                        exportCsv={() => {
                          generateAndDownloadCSV(filteredTasks, "teste", "GTPP-documento");
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
                                  id={task.id}
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
        {openCardDefault && <ModalDefault taskFilter={task} details={taskDetails} close_modal={() => { setOpenCardDefault(false); clearGtppWsContext() }} />}
      </Container>
    </div>
  );
}
