const express = require('express');
const cors = require('cors');
const app = express();
const { spawn } = require('child_process');
const fs = require('fs');

const { createDB,  insertToDB, getInfoFromDB} = require('./db.js');
app.use(cors());

function runScript(pythonScriptPath, res, req, request){
  var answer = req.query;
  const pathOrURL = Object.entries(answer)[0];
  const scriptParameters = [pathOrURL[0], request];
  const runPython = spawn('python', [pythonScriptPath, ...scriptParameters]);
  runPython.on('close', (code) => {
    fs.readFile('./result.txt', 'utf8', (err, data) => {
      res.json(data);
    });
  });
}

function connectToServer(){
  createDB();
  getInfoFromDB().then((getInfo) => {
  app.get("/", (req, res) => {
      res.json(getInfo);
    });
    app.get("/path", async (req, res) => {
      const pythonScriptPath = './CuckooCommands.py';
      const request = "File";
      runScript(pythonScriptPath, res, req, request);
      
    });
    app.get("/URL", async (req, res) => {
      const pythonScriptPath = './CuckooCommands.py';
      const request = "URL";
      runScript(pythonScriptPath, res, req, request);
    });
  });

  app.listen(7000, () => {
    console.log(`Server is running on port 7000.`);
  });
};

connectToServer();