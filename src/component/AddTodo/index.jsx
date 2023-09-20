import React, { memo, useState } from "react";
import "./index.css";

import { Input, Button, Select, Upload, DatePicker, TimePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import utils from "../../utils";

const { Option } = Select;

const AddTodo = ({
  inputRef,
  todo,
  msgErr,
  handleOnChangeValue,
  handleAddTodo,
  isAdd = true,
  searchValue,
  setSearchValue,
  sortOrder,
  setSortOrder,
  selectedFilter,
  setSelectedFilter,
}) => {
  const [fileList, setFileList] = useState([]); //state input file
  return (
    <div className="todo-list-header">
      <div className="todo-list-add">
        <div className="todo-list-wrap">
          <Input
            status={msgErr?.name && "error"}
            ref={inputRef}
            placeholder="Add a todo"
            value={todo?.name}
            onChange={(e) => handleOnChangeValue(e.target.value, "name")}
            onPressEnter={() => handleAddTodo(setFileList)}
            className="todo-list-input"
          />
          <div className="todo-list-input-error">
            {msgErr?.name && msgErr?.name}
          </div>

          <div className="todo-list-input-info" style={{ display: "flex" }}>
            <Upload
              className="todo-list-upload"
              name="file"
              fileList={fileList}
              beforeUpload={() => {
                // Prevent upload
                return false;
              }}
              onChange={(e) => {
                setFileList([e.file]);
                //handle file to base64
                utils.fileToBase64(e.file, (base64) => {
                  handleOnChangeValue(base64, "fileData");
                  handleOnChangeValue(e.file.name, "fileName");
                });
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            <div className="todo-list-wrap-sort">
              <div>Date :</div>
              <DatePicker
                value={
                  todo?.estimated_date
                    ? dayjs(todo?.estimated_date, "YYYY-MM-DD")
                    : ""
                }
                onChange={(_, d) => handleOnChangeValue(d, "estimated_date")}
              />
              <div>Time :</div>
              {isAdd ? (
                <TimePicker
                  value={
                    todo?.estimated_time
                      ? dayjs(todo?.estimated_time, "HH:mm:ss")
                      : ""
                  }
                  onChange={(_, d) => handleOnChangeValue(d, "estimated_time")}
                />
              ) : (
                <TimePicker
                  defaultValue={
                    todo?.estimated_time
                      ? dayjs(todo?.estimated_time, "HH:mm:ss")
                      : ""
                  }
                  onChange={(_, d) => handleOnChangeValue(d, "estimated_time")}
                />
              )}

              <div className="todo-list-input-error">
                {msgErr?.estimated && msgErr?.estimated}
              </div>
            </div>
          </div>
        </div>
        {isAdd && (
          <Button
            className="todo-list-button-add"
            type="primary"
            onClick={() => handleAddTodo(setFileList)}
          >
            Add
          </Button>
        )}
      </div>

      {isAdd && (
        <div className="todo-list-filter-and-search">
          <Input
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="todo-list-search"
          />

          <div>
            <Select
              defaultValue="ascend"
              value={sortOrder}
              onChange={(value) => setSortOrder(value)}
              className="todo-list-sort"
            >
              <Option value="ascend">Ascend</Option>
              <Option value="descend">Descend</Option>
            </Select>
            <Select
              defaultValue="all"
              value={selectedFilter}
              onChange={(value) => setSelectedFilter(value)}
              className="todo-list-filter"
            >
              <Option value="all">All</Option>
              <Option value="done">Done</Option>
              <Option value="undone">Undone</Option>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(AddTodo);
