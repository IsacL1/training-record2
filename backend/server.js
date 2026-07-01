const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { Worker } = require('worker_threads');
const connectDB = require('./conn.js');

const { athletesAllRecordsModel, athletesInfoModel, speedSlalomRecordsModel,
  slideTricksModel, slideRecordsModel, locationInfoSchemaModel, RecordModeModel } = require('./models/schema.js');


// Import the checkCPU function from the checkCPU.js file
// const { checkCPU, getCPUUsage } = require('./checkCPU.js');

const app = express();
const PORT = process.env.PORT || 3001 || 6660;

// const allowedOrigins = [
//   'http://localhost:6660',
//   'http://localhost:3001'
// ];

// add CORS middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:6660');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  next();
});

connectDB();

// Function to run a worker thread
// function runService(data) {
//   const workerData = data; // Define workerData here
//   return new Promise((resolve, reject) => {
//     const worker = new Worker(path.resolve(__dirname, 'worker.js'), {
//       workerData: workerData,
//     });

//     worker.on('message', resolve);
//     worker.on('error', reject);
//     worker.on('exit', (code) => {
//       if (code !== 0) {
//         reject(new Error(`Worker stopped with exit code ${code}`));
//       }
//     });

//     // Send data to the worker
//     worker.postMessage(workerData);
//   });
// }

app.post('/api/login', async (req, res) => {

  const { phone, birthMonth } = req.body;

  // vaildation
  if (!phone?.match(/^\d{8}$/) || !birthMonth?.match(/^(?:[1-9]|1[0-2])$/)) {
    return res.status(400).json({ error: 'Invaild phone number or birth month' });
  }

  try {
    // inquiry phone number and birth month to match
    const athlete = await athletesInfoModel.findOne({
      phone: phone,
      $expr: { $eq: [{ $month: '$bod' }, parseInt(birthMonth)] }
    });

    if (!athlete) {
      return res.status(401).json({ error: 'Verify failed, please check input message' });
    }

    // return user information and training records
    const { athleteId, athleteName, phone: athletePhone } = athlete;
    res.json({
      success: true,
      user: { athleteId, athleteName, athletePhone }
    });

  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    //connectDB().close();
  }
});


// get request from mongoDB
// Get all athletes information
app.get('/api/getAthletesInfo', async (req, res) => {
  await athletesInfoModel.find({}).then(function (athletesRecord) {
    res.json(athletesRecord);
  }).catch((err) => {
    console.error(err);
    res.status(500).json({ message: 'Error fetching data' });
  });
});


// Get athletes names
app.get('/api/getAthletesInfo/athletes', async (req, res) => {
  try {
    const athletes = await athletesInfoModel.find().select('athleteId athleteName');
    // console.log(athletes);
    if (!athletes.length) {
      return res.status(200).json([]); // or res.status(404).json({ message: 'No athletes found' })
    }
    res.json(athletes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

});

app.get('/api/athletes/count', async (req, res) => {
  try {
    const count = await athletesInfoModel.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error retrieving athlete count:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});


// POST route to handle adding SS records
// backend/server.js
app.get('/api/getSSRecords', async (req, res) => {
  try {
    const type = req.query.recordType || 'Normal';
    const records = await speedSlalomRecordsModel.find(
      {
        "recordType": type,
        "SSResult": { $gt: 0 }
      }
    );
    console.log('get SS ' + type + ' record succssfully');

    res.json(records);
    // console.log(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
  // checkCPU();
  // getCPUUsage();
});

// Get slide tricks
app.get('/api/getTricks', async (req, res) => {
  const level = typeof req.query.level === 'string' ? req.query.level : undefined;
  const family = typeof req.query.family === 'string' ? req.query.family : undefined;
  const trickSubFamily = typeof req.query.trickSubFamily === 'string' ? req.query.trickSubFamily : undefined;

  try {
    let query = {};
    if (level) query['trickLevel'] = level; // Fixed with bracket notation
    if (family !== undefined) query['trickFamily'] = family; // Fixed with bracket notation
    if (trickSubFamily !== undefined) query['trickSubFamily'] = trickSubFamily; // Fixed with bracket notation

    const tricks = await slideTricksModel.find(query).select('trickId trickName trickLevel trickFamily')
      .lean() // Convert to plain JS objects
      .exec(); // Execute the query

    // Remove duplicates based on trickId
    const uniqueTricks = Array.from(new Map(tricks.map(trick => [trick.trickId, trick])).values());
    res.json(uniqueTricks);
    // res.json(tricks);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.get('/api/trick-families', async (req, res) => {
  const { level } = req.query;
  try {
    const families = await slideTricksModel.distinct('trickFamily',
      level ? { trickLevel: level } : {}
    );
    res.json(families);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.get('/api/getLocationInfo/location', async (req, res) => {
  try {
    const locationInfo = await locationInfoSchemaModel.find();
    res.json(locationInfo);
    // console.log("locationInfo", locationInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/api/getLocationInfo/recordmode', async (req, res) => {
  try {
    const recordMode = await RecordModeModel.find();
    res.json(recordMode);
    // console.log("recordMode", recordMode, "\n type", typeof recordMode);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// post request to mongoDB
// Insert data to MongoDB
app.post('/api/addSSRecord', async (req, res) => {
  console.log('Received request to add SS record');

  try {
    const newSSRecord = req.body;
    console.log(newSSRecord);

    const result = await speedSlalomRecordsModel.create(newSSRecord);
    console.log(result);
    res.status(201).json({ message: 'SS record added successfully', result });
  } catch (error) {
    console.error("Error in /api/addSSRecord:", error); // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
  // checkCPU();
});

app.post('/api/addSlideRecord', async (req, res) => {
  const { athleteName, trickLevel, trickFamily, trickName, timestamp, distance, recordType, notes,
    speed, steps, floorType, entry, comboTricks } = req.body;
  // console.log("req: ", req.body);
  // Basic validation
  if (!athleteName || !trickLevel || !trickName || !recordType) {
    return res.status(400).json({ error: 'Missing required fields: athleteName, trickLevel, trickName, recordType' });
  } else if (recordType !== 'Normal' && recordType !== 'Details') {
    return res.status(400).json({ error: 'Invalid recordType. Must be "Normal" or "Details"' });
  } else if (distance && typeof distance !== 'number') {
    return res.status(400).json({ error: 'Invalid distance. Must be a number' });
  }

  // Aadvanced validation (if needed)
  if (speed && typeof speed !== 'number' && comboNum && typeof comboNum !== 'number') {
    return res.status(400).json({ error: 'Invalid speed & comboNum. Must be a number' });
  } else if (entry && typeof entry !== 'string' && comboTricks && typeof comboTricks !== 'string') {
    return res.status(400).json({ error: 'Invalid entry. Must be a string' });
  }

  try {
    const newRecord = new slideRecordsModel({
      athleteName,
      trickLevel,
      trickFamily, // Will be undefined if not provided
      trickSubFamily,
      trickName,
      distance,
      recordType,
      notes,
      timestamp,
      // Add other fields as necessary
      steps,
      floorType,
      speed,
      entry,
      comboTricks,
    });

    // console.log('New record:', newRecord);
    const savedRecord = await newRecord.save();
    res.status(201).json({ message: 'Record added successfully', record: savedRecord });
    console.log('Record added successfully');
  } catch (error) {
    console.error('Error adding record:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/addAthleteInfo', async (req, res) => {
  console.log('Received request to add Athlete Info');

  try {
    console.log('Athlete ID:', req.body.athleteId);
    console.log(req.body);

    const newAthletesInfo = new athletesInfoModel(req.body);
    await newAthletesInfo.save();
    res.send('Athlete created, record added successfully!');
    console.log('Records added successfully!');

  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).send('Internal Server Error');
  }
  // checkCPU();
});


app.post('/api/uploadAthleteInfo', async (req, res) => {
  try {
    const fileData = req.body.file;
    const fileType = req.body.type;


    if (fileType === 'application/json') {
      try {
        // Process the JSON data
        // const jsonData = fileData;
        const jsonData = JSON.parse(fileData);
        // console.log(jsonData);
        if (Array.isArray(jsonData)) {
          // const jsonData = JSON.parse(file.buffer.toString());
          const newAthletesInfo = jsonData.map((item) => new athletesInfoModel(item));
          await athletesInfoModel.insertMany(newAthletesInfo);
          res.send('Data inserted successfully!');
        } else {
          res.status(400).send('Invalid JSON data');
        }
      } catch (error) {
        console.error('Error processing JSON:', error);
        res.status(400).send('Invalid JSON data');
      }
    } else if (fileType === 'text/csv') {
      const csvData = [];
      const csv = require('csv-parser');
      const readStream = file.buffer.createReadStream();
      readStream.pipe(csv()).on('data', (row) => {
        csvData.push(row);
      }).on('end', async () => {
        const newAthletesInfo = csvData.map((item) => new athletesInfoModel(item));
        await athletesInfoModel.insertMany(newAthletesInfo);
        res.send('Data inserted successfully!');
      });
    } else {
      res.status(400).send('Unsupported file type. Please upload a JSON or CSV file.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting data');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
