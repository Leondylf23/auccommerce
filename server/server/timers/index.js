const db = require("../../models");

// Import Functions
const ItemStatus = require("./ItemStatus");
const PaymentStatus = require("./PaymentStatus");

const loadTimerFunctions = async () => {
  console.log(["Info"], "Loading all timer functions");

  try {
    // Load unfinished tasks from db
    const dataDb = await db.timer.findAll({
      where: { isActive: true },
      // raw: true
    });

    const data = dataDb.map((dataVals) => dataVals?.dataValues);

    // Load functions with timer datas. Ex -> 'FunctionName(timerData in Arr)'
    ItemStatus.itemsStatusAppend(
      data?.filter((filterData) => filterData?.type === "ITEM_STATUS")
    );
    PaymentStatus.paymentStatusAppend(
      data?.filter((filterData) => filterData?.type === "PAYMENT_STATUS")
    );
  } catch (error) {
    console.log(
      ["Error"],
      "Timer load error! Unfinished task(s) will not be loaded until next restart!",
      error
    );
  }

  //   const task = cron.schedule(
  //     "45 1 1 3 *",
  //     () => {
  //       console.log("running every minute 1, 2, 4 and 5");
  //     },
  //     {
  //       scheduled: true,
  //       timezone: "Asia/Jakarta",
  //     }
  //   );
  //   task.start();
};

module.exports = loadTimerFunctions;
