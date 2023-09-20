import React, { useEffect, useRef, useState } from "react";
import "./index.css";

import { Button, List, Modal, Popover } from "antd";
import {
  CheckCircleOutlined,
  CheckCircleFilled,
  DeleteOutlined,
  EditOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import AddTodo from "../AddTodo";

import utils from "../../utils";

const ItemTodo = ({
  todo,
  msgErr,
  handleDeleteTodo,
  handleMarkDone,
  handleUpdateTodo,
  handleDownloadFile,
}) => {
  const [newTodo, setNewTodo] = useState(todo);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCountdown, setShowCountdown] = useState(true);
  const [estimated, setEstimated] = useState(""); //estimated countdown
  const [timeEnd, setTimeEnd] = useState();

  let interval = useRef();

  const showModalEdit = () => {
    setIsModalOpen(true);
  };

  const closeModalEdit = () => {
    setIsModalOpen(false);
  };

  const handleOnChangeValue = (e, value) => {
    setNewTodo((prev) => ({ ...prev, [value]: e }));
  };

  const handleCountDown = () => {
    const datetime = `${todo?.estimated_date}T${todo?.estimated_time}`;

    if (todo.estimated_time) {
      const dateTime = new Date(datetime).getTime();

      interval.current = setInterval(() => {
        const currentDate = new Date().getTime();
        const timeRemaining = dateTime - currentDate;
        setTimeEnd(timeRemaining);

        if (timeRemaining <= 0) {
          setEstimated("Hết thời gian!");
          clearInterval(interval.current);
        } else {
          setEstimated(utils.countdownDateTime(timeRemaining));
        }
      }, 1000);
    }
  };

  useEffect(() => {
    setNewTodo(todo);
    //start countdown on change todo
    handleCountDown();

    return () => {
      //cleanup interval when the component unmounts
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [todo]);

  return (
    <>
      <List.Item
        className={`todo-item ${todo.isDone ? "todo-item-done" : ""}`}
        actions={[
          <div
            className={`todo-item-icon todo-item-icon-download todo-item-download ${
              !todo.fileData ? "todo-item-hide" : ""
            }`}
            onClick={() => handleDownloadFile(todo.fileData, todo.fileName)}
          >
            <DownloadOutlined />
          </div>,
          <div
            onClick={() => showModalEdit()}
            className="todo-item-icon todo-item-icon-edit"
          >
            <EditOutlined />
          </div>,
          <div
            onClick={() => handleMarkDone(newTodo.id)}
            className="todo-item-icon todo-item-icon-done"
          >
            {todo.isDone ? <CheckCircleFilled /> : <CheckCircleOutlined />}
          </div>,
          <div
            onClick={() => handleDeleteTodo(newTodo.id)}
            className="todo-item-icon todo-item-icon-delete"
          >
            <DeleteOutlined />
          </div>,
        ]}
      >
        <div className="todo-item-wrap">
          {todo.name}
          <Popover
            content={
              <div
                className={`todo-item-estimated ${
                  timeEnd <= 0 && "todo-item-estimated-ended"
                }`}
              >
                {todo.estimated_date && showCountdown
                  ? `${todo?.estimated_date}
                ${todo?.estimated_time}`
                  : estimated}
              </div>
            }
          >
            <div
              className={`todo-item-estimated ${
                timeEnd <= 0 && "todo-item-estimated-ended"
              }`}
              onClick={() => setShowCountdown(!showCountdown)}
            >
              {todo.estimated_date && showCountdown
                ? estimated
                : `${todo?.estimated_date} ${todo?.estimated_time}`}
            </div>
          </Popover>
        </div>
      </List.Item>

      <Modal
        width="50%"
        title="Update todo"
        open={isModalOpen}
        onCancel={closeModalEdit}
        footer={[
          <Button key="cancel" onClick={closeModalEdit}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() =>
              handleUpdateTodo(newTodo.id, newTodo, closeModalEdit)
            }
          >
            Update
          </Button>,
        ]}
      >
        <AddTodo
          todo={newTodo}
          msgErr={msgErr}
          isAdd={false}
          handleOnChangeValue={handleOnChangeValue}
        />
      </Modal>
    </>
  );
};

export default ItemTodo;
