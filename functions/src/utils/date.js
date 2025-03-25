const { Timestamp } = require("../configs/firebase.config");

const getDateRange = (type, options = {}) => {
  const date = new Date();
  let start, end;

  if (type === "week") {
    const dayOfWeek = date.getDay();
    start = new Date(date);
    start.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    start.setHours(0, 0, 0, 0);

    end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  } else if (type === "month") {
    const year = options.year || date.getFullYear();
    start = new Date(year, 0, 1);
    start.setHours(0, 0, 0, 0);

    end = new Date(year, 11, 31);
    end.setHours(23, 59, 59, 999);
  } else if (type === "year") {
    const startYear = options.startYear || date.getFullYear();
    const endYear = options.endYear || date.getFullYear();
    start = new Date(startYear, 0, 1);
    start.setHours(0, 0, 0, 0);

    end = new Date(endYear, 11, 31);
    end.setHours(23, 59, 59, 999);
  }

  return {
    startTimestamp: Timestamp.fromDate(start),
    endTimestamp: Timestamp.fromDate(end),
  };
};

const formattedTransactionDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

module.exports = { getDateRange, formattedTransactionDate };
