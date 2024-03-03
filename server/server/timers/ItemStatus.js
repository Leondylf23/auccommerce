const _ = require("lodash");
const EventEmitter = require("events");
const cron = require("node-cron");
const db = require("../../models");
const { setTimerEventData: timerEventPayment } = require("./PaymentStatus");

// SCOPE VARIABLES
let runningTasks = [];

const event = new EventEmitter();
const paymentTimerEvent = timerEventPayment();

// PRIVATE FUNCTIONS
const __updateItemStatus = async (id, dataUpdate) => {
  try {
    const getData = await db.item.findOne({
      where: { id },
    });

    await getData.update({ status: dataUpdate?.status });
  } catch (error) {
    console.log(["Error"], "Error updating status for items!");
  }
};
const __deleteTimerData = async (id) => {
  try {
    const findTaskIndex = runningTasks.findIndex((task) => task?.id === id);
    if (findTaskIndex !== -1) runningTasks.splice(findTaskIndex, 1);

    const getData = await db.timer.findOne({
      where: { id },
    });

    await getData.update({ isActive: false });
  } catch (error) {
    console.log(["Error"], "Error deleting timer data!");
  }
};
const __updateBidWinner = async (itemId) => {
  let tryCount = 5;

  const updateDataFunc = async () => {
    try {
      const winnerData = await db.bid.findOne({
        where: { itemId },
        order: [["bidPlacePrice", "DESC"]],
        limit: 1,
      });

      if (_.isEmpty(winnerData)) return;

      const updateData = await winnerData.update({ status: "WAITING" });
      if (!updateData) throw new Error("Couldn't update winner data");

      const dateNow = new Date();
      dateNow.setHours(dateNow.getHours() + 24);

      paymentTimerEvent.emit("PaymentStatus/SET_NEW_TASK", { dataId: winnerData?.id, dateActivate: dateNow.toISOString(), dataValue: { status: "FAILED" } });
    } catch (error) {
      if (tryCount > 0) {
        console.log(
          ["Error"],
          `Error updating winner data. Trying to update next 10 seconds. ${tryCount} count left.`
        );

        // eslint-disable-next-line no-plusplus
        tryCount--;

        setTimeout(() => {
          updateDataFunc();
        }, 10000);
      } else if (tryCount < 1) {
        console.log(
          ["Error"],
          "Error updating winner data. All count are used!"
        );
      }
    }
  };
  updateDataFunc();
};
const __executeTask = async (timerId, dataId, dataValue) => {
  if (dataValue?.status === "DEACTIVATED") __updateBidWinner(dataId);
  __updateItemStatus(dataId, dataValue);
  __deleteTimerData(timerId);
};

// Initialize function
const itemsStatusAppend = async (timerDatas) => {
  try {
    // Check Timers
    const dateNow = new Date().getTime();

    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < timerDatas.length; index++) {
      const timer = timerDatas[index];

      const dateTimer = new Date(timer?.dateActivate);
      const dateTimerMs = dateTimer.getTime();

      if (dateTimerMs > dateNow) {
        const pattern = `${dateTimer.getMinutes()} ${dateTimer.getHours()} ${dateTimer.getDate()} ${
          dateTimer.getMonth() + 1
        } *`;
        const task = cron.schedule(
          pattern,
          () => __executeTask(timer?.id, timer?.dataId, timer?.activateValue),
          {
            scheduled: true,
            timezone: "Asia/Jakarta",
          }
        );
        task.start();

        runningTasks.push({
          id: timer?.id,
          dataId: timer?.dataId,
          taskData: task,
          value: timer?.activateValue,
        });
      } else {
        __executeTask(timer?.id, timer?.dataId, timer?.activateValue);
      }
    }
  } catch (error) {
    console.log(["Error", "Timer function 'ItemStatus' has error!"]);
  }
};

// Event functions
const appendTimer = async ({ dataId, dateActivate, dataValue }) => {
  try {
    const createTimerData = await db.timer.create({
      dateActivate,
      dataId,
      type: "ITEM_STATUS",
      activateValue: dataValue,
    });

    const createdId = createTimerData?.id;
    const dataDate = new Date(dateActivate);

    const pattern = `${dataDate.getMinutes()} ${dataDate.getHours()} ${dataDate.getDate()} ${
      dataDate.getMonth() + 1
    } *`;
    const task = cron.schedule(
      pattern,
      () => __executeTask(createdId, dataId, dataValue),
      {
        scheduled: true,
        timezone: "Asia/Jakarta",
      }
    );
    task.start();

    runningTasks.push({
      id: createdId,
      dataId,
      taskData: task,
      value: dataValue,
    });

    console.log(
      ["Info"],
      `ItemStatus timer task has been created! Timer id: ${createdId}`
    );
  } catch (error) {
    console.log(["Error"], "Error executing appendTimer!", error.message);
  }
};

const stopTimerTaskByDataId = async ({ dataId }) => {
  try {
    const filtered = runningTasks.filter((timer) => timer.dataId === dataId);

    filtered.forEach((dataTimer) => {
      dataTimer.taskData.stop();
    });

    runningTasks = runningTasks.filter((data) => data?.dataId !== dataId);

    const timerDb = await db.timer.update({ isActive: false }, {
      where: { dataId, isActive: true },
    });

    console.log(
      ["Info"],
      `ItemStatus timer task has been stopped! Data id: ${dataId}.`
    );
  } catch (error) {
    console.log(
      ["Error"],
      "Error executing stopTimerTaskByDataId!",
      error.message
    );
  }
};

// Register Events
event.on("ItemStatus/SET_NEW_TASK", appendTimer);
event.on("ItemStatus/STOP_TASK_BY_DATA_ID", stopTimerTaskByDataId);

const setTimerEventData = () => event;

module.exports = {
  itemsStatusAppend,
  setTimerEventData,
};
