const EventEmitter = require("events");
const cron = require("node-cron");
const db = require("../../models");

// SCOPE VARIABLES
const runningTasks = [];

const ItemsStatusFunctions = async (timerDatas) => {
  try {
    // PRIVATE FUNCTIONS
    const __updateItemStatus = async (id, dataUpdate) => {
      try {
        const getData = await db.item.findOne({
          where: { id },
        });

        await getData.update({ status: dataUpdate });
      } catch (error) {
        console.log(["Error"], "Error updating status for items!");
      }
    };
    const __deleteTimerData = async (id) => {
      try {
        const getData = await db.timer.findOne({
          where: { id },
        });

        await getData.update({ isActive: false });
      } catch (error) {
        console.log(["Error"], "Error deleting timer data!");
      }
    };
    const __executeTask = async (timerId, dataId, dataValue) => {
      await __updateItemStatus(dataId, dataValue?.status);
      await __deleteTimerData(timerId);
    };

    // Check Timers
    const dateNow = new Date().getTime();

    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < timerDatas.length; index++) {
      const timer = timerDatas[index];

      const dateTimer = new Date(timer?.dateActivate);
      const dateTimerMs = dateTimer.getTime();

      if (dateTimerMs > dateNow) {
        const task = cron.schedule(
          `${dateTimer.getSeconds()} ${dateTimer.getMinutes()} ${dateTimer.getHours()} ${dateTimer.getDate()} ${dateTimer.getMonth()} *`,
          () =>
            __executeTask(
              timer?.id,
              timer?.dataId,
              timer?.activateValue?.status
            ),
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
        });
      } else {
        __executeTask(timer?.id, timer?.dataId, timer?.activateValue?.status);
      }
    }

    // Event functions
    const appendTimer = async ({ dataId, dateActivate, dataValue }) => {
      try {
        const createTimerData = db.timer.create({
          dateActivate,
          dataId,
          type: "ITEM_STATUS",
          activateValue: dataValue,
        });

        const createdId = createTimerData?.id;
        const dataDate = new Date(dateActivate);

        const task = cron.schedule(
          `${dataDate.getSeconds()} ${dataDate.getMinutes()} ${dataDate.getHours()} ${dataDate.getDate()} ${dataDate.getMonth()} *`,
          () => __executeTask(createdId, dataId, dataValue?.status),
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
        const findTaskIndex = runningTasks.findIndex(
          (task) => task?.dataId === dataId
        );

        if (findTaskIndex === -1)
          throw new Error(`Task data not found from data id: ${dataId}!`);

        runningTasks[findTaskIndex].taskData.stop();

        const timerDb = await db.timer.findOne({
          where: { id: runningTasks[findTaskIndex]?.id },
        });

        await timerDb.update({ isActive: false });

        console.log(
          ["Info"],
          `ItemStatus timer task has been stopped! Data id: ${dataId}, Timer id: ${timerDb?.id}`
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
    const event = new EventEmitter();

    event.on("ItemStatus/SET_NEW_TASK", appendTimer);
    event.on("ItemStatus/STOP_TASK_BY_DATA_ID", stopTimerTaskByDataId);

    event.on("test", (data) => console.log("test", data));
  } catch (error) {
    console.log(["Error", "Timer function 'ItemStatus' has error!"]);
  }
};

module.exports = ItemsStatusFunctions;
