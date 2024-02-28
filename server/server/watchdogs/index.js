// const db = require("../../models");
// const { setKeyJSONValue, getKeyJSONValue } = require("../services/redis");

// const activeTimers = [];

// const initializeTimers = async () => {
//   try {
//     let timersData = [];
//     const fetchRedis = await getKeyJSONValue("TIMERS-DATA");

//     if (fetchRedis) {
//       timersData = fetchRedis;
//     } else {
//       const timersDb = db.timer.fetchAll({ where: { isActive: true } });
//       timersData = timersDb.map((data) => data?.dataValues);
//     }

//     for (let index = 0; index < timersData.length; index++) {
//         const timer = timersData[index];
        
//         const getTimeNow = new Date();
//         getTimeNow.setHours(getTimeNow.getHours() + 7);
//         const dateNow = getTimeNow.toISOString().replace("T", " ").slice(0, 19);


//     }
//   } catch (error) {
//     console.log(["Error"], "Error initializing timers!");
//   }
// };
