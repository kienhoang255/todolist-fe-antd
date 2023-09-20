import React, { useState, useRef, useEffect } from "react";
import "./index.css";
import utils from "../utils";

import { useDispatch, useSelector } from "react-redux";
import { v4 as idv4 } from "uuid";

import { List } from "antd";
import { OrderedListOutlined } from "@ant-design/icons";

import ItemTodo from "../component/ItemTodo";
import AddTodo from "../component/AddTodo";
import {
  addTodo,
  deleteTodo,
  editTodo,
  markIsDone,
  setData,
} from "../store/reducer/todo";

const MainView = () => {
  const dispatch = useDispatch();
  const todoStore = useSelector((state) => state.todo.data);

  const inputRef = useRef(null);

  const [todos, setTodos] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortOrder, setSortOrder] = useState("ascend"); // ascend, Descend
  const [selectedFilter, setSelectedFilter] = useState("all"); // all, done, undone

  const [todo, setTodo] = useState({
    id: idv4(),
    name: "",
    estimated_time: "",
    estimated_date: "",
    isDone: false,
    fileData: "",
    fileName: "",
  });
  //state alert message error(field name and field estimated)
  const [msgErr, setMsgErr] = useState({ name: "", estimated: "" });

  //sort list and save to local storage after todoStore change
  useEffect(() => {
    handleSearchSortFilter(todoStore, sortOrder, selectedFilter, searchValue);
    //save to local storage
    handleSaveToLocalStorage();
  }, [todoStore]);

  const handleOnChangeValue = (e, value) => {
    setTodo((prev) => ({ ...prev, [value]: e }));
  };

  //validate value input
  const handleCheckValueInput = (data) => {
    const checkName = utils.checkIsEmpty(data.name);
    const checkDate = utils.checkIsEmpty(data.estimated_date);
    const checkTime = utils.checkIsEmpty(data.estimated_time);

    if (checkName) {
      setMsgErr((prev) => ({ ...prev, name: "Please fill your todo name!" }));
    } else {
      setMsgErr((prev) => ({ ...prev, name: "" }));
    }

    //require fill both field date and time or not
    if ((checkDate && checkTime) || (!checkDate && !checkTime)) {
      setMsgErr((prev) => ({ ...prev, estimated: "" }));
    } else {
      setMsgErr((prev) => ({
        ...prev,
        estimated: "You need to fill both date and time fields!",
      }));
    }

    if (
      ((checkDate && checkTime) || (!checkDate && !checkTime)) &&
      !checkName
    ) {
      return true;
    } else return false;
  };

  const handleAddTodo = (clearFileList) => {
    if (handleCheckValueInput(todo)) {
      dispatch(addTodo(todo));

      //set data todo default
      setTodo({
        id: idv4(),
        name: "",
        estimated_time: "",
        estimated_date: "",
        isDone: false,
        fileName: "",
        fileData: "",
      });
      //clear list input file(antd issue)
      clearFileList([]);

      //handle focus input when added
      inputRef.current.focus();
    }
  };

  const handleDeleteTodo = (id) => {
    dispatch(deleteTodo(id));
    //clear local storage
    if (todoStore.length == 1) {
      utils.saveToLocalStorage("todoList", "");
    }
  };

  const handleMarkDone = (id) => {
    dispatch(markIsDone(id));
  };

  const handleUpdateTodo = (id, data, callback) => {
    if (handleCheckValueInput(data)) {
      dispatch(editTodo({ id, data }));
      //close modal when update success
      callback();
    }
  };

  const handleSearchSortFilter = (data, sort, filter, query) => {
    let result = [...data];

    //search name by query
    if (query != "") result = utils.filterItemByX(result, "name", query);

    //sort object is missing estimated_time and estimated_dat
    result = utils.sortItemMissingEstimate(result);

    //sort by order
    result = utils.sortOrderEstimatedDateTime(result, sort);

    if (filter == "done") {
      result = result.filter((f) => f.isDone == true);
    } else if (filter == "undone") {
      result = result.filter((f) => f.isDone == false);
    }

    setTodos(result);
  };

  //debounce to handle search filter sort
  useEffect(() => {
    let debounce;
    if (todoStore.length > 0) {
      debounce = setTimeout(() => {
        handleSearchSortFilter(
          todoStore,
          sortOrder,
          selectedFilter,
          searchValue
        );
      }, 400);
    }

    return () => clearTimeout(debounce);
  }, [searchValue, sortOrder, selectedFilter]);

  const handleSaveToLocalStorage = () => {
    if (todoStore.length > 0) {
      utils.saveToLocalStorage("todoList", todoStore);
    }
  };

  //get todo list from local storage
  useEffect(() => {
    if (todoStore.length == 0) {
      const value = utils.takeFromLocalStorage("todoList");
      if (value != null) {
        dispatch(setData(value));
      }
    }
  }, []);

  const handleDownloadFile = (file, name) => {
    const link = document.createElement("a");
    link.href = file;
    link.download = name;
    link.click();
  };

  return (
    <div className="todo-list">
      <div className="todo-list-title">
        <div className="todo-list-title-icon-box">
          <OrderedListOutlined className="todo-list-title-icon" />
        </div>
        My Todo List
      </div>
      <AddTodo
        msgErr={msgErr}
        inputRef={inputRef}
        todo={todo}
        handleOnChangeValue={handleOnChangeValue}
        handleAddTodo={handleAddTodo}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />
      <List
        className="todo-list-items"
        dataSource={todos}
        renderItem={(todo, index) => (
          <ItemTodo
            todo={todo}
            msgErr={msgErr}
            index={index}
            handleDeleteTodo={handleDeleteTodo}
            handleMarkDone={handleMarkDone}
            handleUpdateTodo={handleUpdateTodo}
            handleDownloadFile={handleDownloadFile}
          />
        )}
      />
    </div>
  );
};

export default MainView;
