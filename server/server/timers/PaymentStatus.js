const _ = require("lodash");
const EventEmitter = require("events");
const cron = require("node-cron");
const db = require("../../models");
const { setKeyValue } = require("../services/redis");

// SCOPE VARIABLES
let runningTasks = [];

const event = new EventEmitter();

// PRIVATE FUNCTIONS
const __updatePaymentStatus = async (id, dataUpdate) => {
  try {
    const getData = await db.bid.findOne({
      where: { id, status: "WAITING" },
    });

    if (_.isEmpty(getData)) return;

    if (dataUpdate?.status === "FAILED") {
      const userId = getData?.dataValues?.userId;
      const dateNow = new Date();
      dateNow.setHours(
        dateNow.getHours() + 24,
        dateNow.getMinutes(),
        dateNow.getSeconds()
      );

      const dateNowTime = new Date().getTime();
      const banTimeInSeconds = Math.floor((dateNow.getTime() - dateNowTime) / 1000);

      await db.bid.update({ status: dataUpdate?.status }, {
        where: {
          userId: getData?.dataValues?.userId,
          itemId: getData?.dataValues?.itemId,
        },
      });


      await setKeyValue(`USER-BAN-${userId}`, dateNow.toISOString(), banTimeInSeconds);
    } else {
      await getData.update({ status: dataUpdate?.status });
    }
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
        where: { itemId, status: "PLACED" },
        order: [["bidPlacePrice", "DESC"]],
        limit: 1,
      });

      if (_.isEmpty(winnerData)) return;

      const updateData = await winnerData.update({ status: "WAITING" });
      if (!updateData) throw new Error("Couldn't update winner data");

      const dateNow = new Date();
      dateNow.setHours(dateNow.getHours() + 24);

      event.emit("PaymentStatus/SET_NEW_TASK", { dataId: winnerData?.id, dateActivate: dateNow.toISOString(), dataValue: { status: "FAILED" } });
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
  __updatePaymentStatus(dataId, dataValue);
  __deleteTimerData(timerId);
};

// Initialize function
const paymentStatusAppend = async (timerDatas) => {
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
    console.log(["Error", "Timer function 'PaymentStatus' has error!"]);
  }
};

// Event functions
const appendTimer = async ({ dataId, dateActivate, dataValue }) => {
  try {
    const createTimerData = await db.timer.create({
      dateActivate,
      dataId,
      type: "PAYMENT_STATUS",
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
      `PaymentStatus timer task has been created! Timer id: ${createdId}`
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
      `PaymentStatus timer task has been stopped! Data id: ${dataId}, Timer id: ${timerDb?.id}`
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
event.on("PaymentStatus/SET_NEW_TASK", appendTimer);
event.on("PaymentStatus/STOP_TASK_BY_DATA_ID", stopTimerTaskByDataId);

const setTimerEventData = () => event;

module.exports = {
  paymentStatusAppend,
  setTimerEventData,
};
