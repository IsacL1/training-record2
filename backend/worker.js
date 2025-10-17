const { workerData, parentPort } = require('worker_threads');
const mongoose = require('mongoose');
const athletesRecordsModel = require('./models/schema.js').athletesRecordsModel;
const connectDB = require('./conn.js');

connectDB();

// Function to add SS records
// async function addSSRecords(athleteName, SSRecords) {
//     try {
//         // let athlete = await Athletes.findOne({ athleteName });
//         const athlete = await athletesRecordsModel.findOne({ athleteName });

//         if (!athlete) {
//             athlete = new Athlete({ athleteName, records: [] });
//         }

//         athlete.records.push(...SSRecords);
//         await athlete.save();

//         return { message: 'SS records added successfully', athlete };
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }

// // Listen for messages from the main thread
// parentPort.on('message', async ({ athleteName, SSRecords }) => {
//     try {
//         const result = await addSSRecords(athleteName, SSRecords);
//         parentPort.postMessage(result);
//     } catch (error) {
//         console.error("Error in worker:", error); // Log the error for debugging
//         parentPort.postMessage({ error: error.message });
//     }
// });