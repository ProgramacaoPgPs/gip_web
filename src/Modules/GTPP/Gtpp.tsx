import React, { useState, useEffect } from "react";
import { useMyContext } from "../../Context/MainContext";
import "./Gtpp.css";
import { Container, Row, Col } from "react-bootstrap";
import { Connection } from "../../Connection/Connection";
import CardTask from "./ComponentsCard/CardTask/CardTask";
import NavBar from "../../Components/NavBar";
import { listPath } from "../mock/mockTeste";
import ColumnTaskState from "./ComponentsCard/ColumnTask/columnTask";
import StructureModal from "../../Components/CustomModal";
import { PDFGenerator, generateAndDownloadCSV } from "../../Class/FileGenerator";
import CustomForm from "../../Components/CustomForm";
import { fieldsetsData } from "./ComponentsCard/ConfigForm/configForm";

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
  }, [setTitleHead]);

  useEffect(() => {
    const connection = new Connection("18", true);
    async function getTaskInformations(): Promise<void> {
      try {
        const getTaskItem = await connection.get(
          `&task_id=${btnValueIdTaskItem}`,
          "GTPP/TaskItem.php"
        );
        setCardTaskItem(getTaskItem);
      } catch (error) {
        console.error("Erro ao obter as informações da tarefa:", error);
      }
    }
    if (btnValueIdTaskItem) {
      getTaskInformations();
    }
  }, [btnValueIdTaskItem]);

  useEffect(() => {
    const connection = new Connection("18", true);
    async function getTaskInformations(): Promise<void> {
      try {
        const getTask = await connection.get("", "GTPP/Task.php");
        const getStatusTask = await connection.get("", "GTPP/TaskState.php");

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
          <Col xs={12} className="d-flex flex-nowrap overflow-auto p-0">
            {cardStateTask?.data.map(
              (cardTaskStateValue: any, idxValueState: any) => {
                const filteredTasks = cardTask?.data.filter(
                  (task: any) => task.state_id === cardTaskStateValue.id
                );
                const isFirstColumnTaskState = idxValueState === 0;
                return (
                  <div
                    key={idxValueState}
                    className="column-task-container p-2 flex-shrink-0"
                  >
                    <ColumnTaskState
                      configId={`task_state_${cardTaskStateValue.id}`}
                      title={cardTaskStateValue.description}
                      bgColor={cardTaskStateValue.color}
                      isFirstColumn={isFirstColumnTaskState}
                      onAdd={() => {
                        setModalPageElement(
                          <div className="card bodyCard">
                            <div className="d-flex justify-content-end align-items-center">
                              <div className="">
                                <button className="btn fa fa-close m-4" onClick={() => setModalPage(false)}></button>
                              </div>
                            </div>
                            <div>
                              <div className="m-3">
                              <CustomForm
                                fieldsets={fieldsetsData} // inputs de registro
                                onSubmit={() => {console.log('teste')}} // botão
                                method="post"
                                className='d-flex flex-column align-items-center justify-center col-8 col-sm-6 col-md-4 col-lg-2 rounded py-4 w-100'
                                id='loginCustomForm'
                              />
                              </div>
                            </div>
                          </div>
                        );
                        setModalPage(true);
                      }}
                      onCsv={() => {
                        //gerador do csv
                        generateAndDownloadCSV(filteredTasks, 'teste', 'GTPP-documento');
                        
                      }}
                      onPdf={() => {
                        
                        // const tasks = [
                        //   {
                        //     description: 'Implementar login',
                        //     state_description: 'Concluído',
                        //     priority: 2,
                        //     initial_date: '2024-09-15',
                        //     final_date: '2024-09-20',
                        //     state_id: 'completed',
                        //     percent: 100,
                        //   },
                        //   {
                        //     description: 'Configurar CI/CD',
                        //     state_description: 'Em andamento',
                        //     priority: 1,
                        //     initial_date: '2024-09-21',
                        //     final_date: '2024-09-25',
                        //     state_id: 'in_progress',
                        //     percent: 75,
                        //   },
                        //   // Adicione mais tarefas conforme necessário
                        // ];

                        setModalPageElement(
                          <div className="card w-75 h-75 position relative">
                            <div className="d-flex justify-content-end align-items-center">
                              <div className="">
                                <button className="btn fa fa-close m-4" onClick={() => setModalPage(false)}></button>
                              </div>
                            </div>
                            <div className="overflow-auto h-75">
                              <div className="m-3">
                                <PDFGenerator data={filteredTasks} configId="completed" />
                              </div>
                            </div>
                          </div>
                        );
                        setModalPage(true);
                      }}
                      contentBody={
                        <div className="task-cards-container">
                          {filteredTasks?.map((task: any, idx: number) => {
                            
                            return (
                              <CardTask
                                key={idx}
                                initial_date={task.initial_date}
                                final_date={task.final_date}
                                titleCard={task.description}
                                priorityCard={task.priority}
                                onClick={() => {
                                  setIdButton(task.id);
                                  setModalPageElement(
                                    <div className="card w-75 h-75">
                                      <div className="col-12 bg-primary header-menu">t</div>
                                      <div className="d-flex overflow-hidden h-100">
                                        <div className="col-7 h-100 bg-danger">
                                          <button className="btn btn-primary m-4" onClick={() => setModalPage(false)}>close</button>
                                        </div>
                                        <div className="col-5 bg-warning">t</div>
                                      </div>
                                    </div>
                                  );
                                  setModalPage(true);
                                }}
                              />
                            )
                          })}
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
