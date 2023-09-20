const checkIsEmpty = (value) => {
  return value.trim() === "" ? true : false;
};

const filterItemByX = (data, x, query) =>
  data.filter((item) => item[x].includes(query.trim()));

const sortOrderEstimatedDateTime = (data, sortOrder) => {
  let result = [...data];
  if (sortOrder == "ascend")
    result.sort((a, b) => {
      const datetimeA = new Date(`${a?.estimated_date}T${a?.estimated_time}`);
      const datetimeB = new Date(`${b?.estimated_date}T${b?.estimated_time}`);
      return datetimeA - datetimeB;
    });
  else {
    result.sort((a, b) => {
      const datetimeA = new Date(`${a?.estimated_date}T${a?.estimated_time}`);
      const datetimeB = new Date(`${b?.estimated_date}T${b?.estimated_time}`);
      return datetimeB - datetimeA;
    });
  }

  return result;
};

const sortItemMissingEstimate = (data) => {
  let result = [];

  data.forEach((e) => {
    if (!e.estimated_date && !e.estimated_time) {
      result = [...result, e];
    } else {
      result = [e, ...result];
    }
  });
  return result;
};

const saveToLocalStorage = (name, value) => {
  localStorage.setItem(name, JSON.stringify(value));
};

const takeFromLocalStorage = (name) => {
  return JSON.parse(localStorage.getItem(name));
};

const fileToBase64 = (file, callback) => {
  if (file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      callback(reader.result);
    };
  }
};

const shortenStr = (str, n) => {
  return str?.length > n ? str.slice(0, n - 1) + "..." : str;
};

const countdownDateTime = (datetime) => {
  const days = Math.floor(datetime / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (datetime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((datetime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((datetime % (1000 * 60)) / 1000);

  return `${days} ngày ${hours}:${minutes}:${seconds}`;
};

export default {
  checkIsEmpty,
  filterItemByX,
  sortOrderEstimatedDateTime,
  sortItemMissingEstimate,
  saveToLocalStorage,
  takeFromLocalStorage,
  fileToBase64,
  shortenStr,
  countdownDateTime,
};
