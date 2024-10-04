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
import {
  PDFGenerator,
  generateAndDownloadCSV,
} from "../../Class/FileGenerator";

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
  const [btnValueIdTaskItem, setBtnValueIdTaskItem] = useState<any>();

  const [openFilter, setOpenFilter] = useState<any>(false);

  const [reset, setReset] = useState<any>(0);

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
  }, [reset]);

  const [selectedStateIds, setSelectedStateIds] = useState<number[]>([]);

  const handleCheckboxChange = (stateId: number) => {
    setSelectedStateIds((prevSelectedStateIds: number[]) => {
      if (prevSelectedStateIds.includes(stateId)) {
        // Se o ID já estiver na lista, removê-lo
        return prevSelectedStateIds.filter((id) => id !== stateId);
      } else {
        // Se o ID não estiver na lista, adicioná-lo
        return [...prevSelectedStateIds, stateId];
      }
    });
  };

  const handleOpenFilter = (e:any) => {
    setOpenFilter((prevOpen:any) => !prevOpen);
  }

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
      <Container fluid className={`h-100 d-flex ${isLandscape ? "flex-row" : "flex-column"} `}>
        <Row className="flex-grow-0">
          <Col xs={12}>
            <header id="headerGipp" className="menu-link">
              <NavBar list={listPath} />
            </header>
          </Col>
        </Row>
        <Row className="flex-grow-1 overflow-hidden">
          <Col xs={12} className="position-relative" style={{padding: 0, marginLeft: 15 }}>
            <h1 onClick={handleOpenFilter} className="cursor-pointer">Filtros <i className="fa fa-angle-down"></i></h1>
            <div className="position-absolute" style={{ zIndex: 1 }}>
              {openFilter ? (
                <div className="bg-light border-dark p-3">
                  {cardStateTask?.data.map(
                    (cardTaskStateValue: any, idxValueState: any) => (
                      <React.Fragment>
                        <div key={idxValueState}>
                          <label className="cursor-pointer">
                            <input
                              type="checkbox"
                              name=""
                              id=""
                              onChange={() =>
                                handleCheckboxChange(cardTaskStateValue.id)
                              }
                              checked={selectedStateIds.includes(
                                cardTaskStateValue.id
                              )}
                            />{" "}
                            {cardTaskStateValue.description}
                          </label>
                        </div>
                      </React.Fragment>
                    )
                  )}
                </div>
              ) : null}
            </div>
          </Col>
          <Col xs={12} className="d-flex flex-nowrap p-0" style={{overflowX: 'auto'}}>
            {cardStateTask?.data.map(
              (cardTaskStateValue: any, idxValueState: any) => {
                // Filtrando tarefas que correspondem ao estado atual
                const filteredTasks = cardTask?.data.filter(
                  (task: any) => task.state_id === cardTaskStateValue.id
                );

                const isFirstColumnTaskState = idxValueState === 0;

                // Verificando se o cardTaskStateValue.id está nos selectedStateIds.
                const isHidden = selectedStateIds.includes(
                  cardTaskStateValue.id
                );

                return (
                  // Renderizando a coluna apenas se o card não estiver oculto
                  !isHidden && (
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
                          setModalPageElement(<Teste />);
                          setModalPage(true);
                        }}
                        onCsv={() => {
                          generateAndDownloadCSV(
                            filteredTasks,
                            "teste",
                            "GTPP-documento"
                          );
                        }}
                        onPdf={() => {
                          setModalPageElement(
                            <div className="card w-75 h-75 position relative">
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
                                  <PDFGenerator
                                    data={filteredTasks}
                                    configId="completed"
                                  />
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
                                        <div className="col-12 bg-primary header-menu">
                                          t
                                        </div>
                                        <div className="d-flex overflow-hidden h-100">
                                          <div className="col-7 h-100 bg-danger">
                                            <button
                                              className="btn btn-primary m-4"
                                              onClick={() =>
                                                setModalPage(false)
                                              }
                                            >
                                              close
                                            </button>
                                          </div>
                                          <div className="col-5 bg-warning">
                                            t
                                          </div>
                                        </div>
                                      </div>
                                    );
                                    setModalPage(true);
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
      </Container>
    </div>
  );

  function Teste(): JSX.Element {
    // Estado para armazenar os dados do formulário
    const [formData, setFormData] = useState({
      description: "",
      initial_date: "",
      final_date: "",
      priority: "1", // valor padrão
    });

    // Manipulador de mudança para atualizar o estado
    const handleChange = (e: any) => {
      const { name, value } = e.target;

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    useEffect(() => {
      console.log(formData);
    }, [formData]);

    // Função para lidar com o envio do formulário
    const handleSubmit = (e: any) => {
      e.preventDefault(); // Impede o envio padrão do formulário
      const connection = new Connection("18", true);
      connection.post(formData, "GTPP/Task.php");
      setReset((prev: any) => prev + 1); // renderizando o componente
    };

    return (
      <div className="card bodyCard">
        <div className="d-flex justify-content-end align-items-center">
          <div>
            <button
              className="btn fa fa-close m-4"
              onClick={() => setModalPage(false)}
            ></button>
          </div>
        </div>
        <div className="m-3">
          <div>
            <label>Description: </label>
            <input
              type="text"
              name="description"
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div>
            <label>Data inicial: </label>
            <input
              type="date"
              name="initial_date"
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div>
            <label>Data final: </label>
            <input
              type="date"
              name="final_date"
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div>
            <label>Prioridade: </label>
            <select
              className="form-select"
              name="priority"
              onChange={handleChange}
            >
              <option value="0">Báixo</option>
              <option value="1">Médio</option>
              <option value="2">Alto</option>
            </select>
          </div>
          <div className="d-flex justify-content-center align-items-center mt-3">
            <button
              onClick={handleSubmit}
              type="submit"
              className="btn btn-success"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    );
  }
}
