import React, { useState, useEffect } from "react";
import { useMyContext } from "../../Context/MainContext";
import "./Gtpp.css";
import { Col } from "react-bootstrap";
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
  const [openFilter, setOpenFilter] = useState<any>(false);
  const [openMenu, setOpenMenu] = useState<any>(true);

  // Modified by Hygor
  const { setTask, setTaskPercent, clearGtppWsContext, setOnSounds, updateStates, setOpenCardDefault, loadTasks, setNotifications, notifications, openCardDefault, taskDetails, states, onSounds, task, getTask } = useWebSocket();
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

  const handleOpenFilter = (e: any) => {
    setOpenFilter((prevOpen: any) => !prevOpen);
  };

  return (
    <div
      id="moduleGTPP"
      className="d-flex flex-row h-100 w-100 position-relative container-fluid m-0 p-0"
    >
      {openMenu && <NavBar list={listPath} />}
      <div className="h-100 d-flex overflow-hidden px-3 flex-grow-1">
        <div className="flex-grow-1 d-flex flex-column justify-content-between align-items-start h-100 overflow-hidden">
          <div className="d-flex w-100 align-items-center justify-content-between my-2 py-2">
            <div className="position-relative">
              <h1 onClick={handleOpenFilter} className="cursor-pointer">
                Estados <i className="fa fa-angle-down"></i>
              </h1>
              <div className="position-absolute filter-modal">
                {openFilter ? (
                  <div className="form-control">
                    {states?.map(
                      (cardTaskStateValue: any, idxValueState: any) => (
                        <div className="d-flex align-items-center" key={idxValueState}>
                          <input
                            id={`filter_state_${cardTaskStateValue.id}`}
                            className="form-check-input"
                            type="checkbox"
                            onChange={() =>
                              handleCheckboxChange(cardTaskStateValue.id)
                            }
                            checked={cardTaskStateValue.active}
                          />
                          <label htmlFor={`filter_state_${cardTaskStateValue.id}`} className="form-check-label mx-2">
                            {cardTaskStateValue.description}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="d-flex flex-row w-50 justify-content-end gap-2">
              <button title={openMenu ? "Ocultar menu" : "Exibir Menu"} onClick={() => setOpenMenu(!openMenu)} className={`btn p-0 d-block d-md-none`} >
                <i className={`fa-solid fa-eye${openMenu ? "-slash" : ''}`}></i>
              </button>
              <button
                className="btn p-0 mx-2 cursor-pointer"
                title={`${onSounds ? "Com audio" : "Sem audio"}`}
                onClick={() => {
                  setOnSounds(!onSounds);
                }}
              >
                <i className={`fa-solid fa-volume-${onSounds ? "high" : "xmark"}`}></i>
              </button>
              <button className="btn p-0">
                <NotificationBell />
              </button>
            </div>
          </div>
          <Col
            xs={12}
            className="d-flex flex-nowrap p-0 menu-expansivo"
            style={{ overflowX: "auto", height: "91%" }}
          >
            {states?.map((cardTaskStateValue: any, idxValueState: any) => {
              const filteredTasks = getTask.filter(
                (task: any) => task.state_id === cardTaskStateValue.id
              );
              // console.log(filteredTasks);
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
                        setModalPageElement(
                          <Cardregister
                            reloadtask={loadTasks}
                            assistenceFunction={() => setModalPage(false)}
                            onClose={() => setModalPage(false)}
                          />
                        );
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
                                <button
                                  className="btn fa fa-close m-4"
                                  onClick={() => setModalPage(false)}
                                ></button>
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
                                key={`simple_card_task_${task.id}`}
                                id={task.id}
                                initial_date={task.initial_date}
                                final_date={task.final_date}
                                title_card={task.description}
                                priority_card={task.priority}
                                percent={task.percent}
                                create_by={task.user_id}
                                onClick={() => {
                                  setTask(task);
                                  setTaskPercent(task.percent);
                                  setOpenCardDefault(true);
                                  setNotifications(
                                    notifications.filter(
                                      (item) => item.task_id != task.id
                                    )
                                  );
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
            })}
          </Col>
        </div>
        {openCardDefault && (
          <ModalDefault
            taskFilter={task}
            details={taskDetails}
            close_modal={() => {
              setOpenCardDefault(false);
              clearGtppWsContext();
            }}
          />
        )}
      </div>
    </div>
  );
}
