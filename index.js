const express = require('express');
const dotenv = require('dotenv');
const path = require("path");
const cors = require('cors');
const connectToMongo = require('./config/db');
const bodyParser = require('body-parser');
const Contact = require('./model/Contact')
const Exceljs = require('exceljs');
// const multer = require('multer');
// const cv = require('./model/FileSchema')

dotenv.config()
connectToMongo();

const app = express();
app.use(bodyParser.json())
app.use(cors());
const port = 5000;

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

app.post('/data', async (req,res)=>{
    try {
        let contact = new Contact();
        contact.name = req.body.name;
        contact.email = req.body.email;
        contact.phone = req.body.phone;

        // const {name, email, phone, originalname, mimetype, buffer} = req.body;
        // const contact = new Contact({name, email, phone, filename: originalname, contentType: mimetype, data: buffer})
        // await contact.save()

        const doc = await contact.save();
        // console.log(doc)
        res.json(doc);
    }
    catch (error) {
        console.error(error.message);
        res.status(401).send("Internal Server Problem");
    }
})

// app.post('/upload', upload.single('cv'), async (req, res) => {
//   try {
//     const { originalname, mimetype, buffer } = req.file;
//     const file = new File({ filename: originalname, contentType: mimetype, data: buffer });
//     await file.save();

//     res.json({ message: 'File uploaded successfully' });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Internal Server Problem');
//   }
// });

app.get('/getData', async (req,res) =>{
  try{
  const docs = await Contact.find({});
  res.json(docs)
  }catch(error){
    console.log(error.message);
    res.status(500).send("Internal server error");
  }

})

app.get('/excel', async (req, res) => {
    try {
      const userData = await Contact.find({});
  
      // Create a new workbook
      const workbook = new Exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Contacts');
  
      // Set headers
      worksheet.addRow(['Name', 'Email', 'Phone']);
  
      // Add data to the worksheet
      userData.forEach(contact => {
        worksheet.addRow([
          contact.name,
          contact.email,
          contact.phone,
        ]);
      });
  
      worksheet.columns.forEach(column => {
                  column.width = 30;
                });
      // Generate the Excel file in memory
      const fileBuffer = await workbook.xlsx.writeBuffer();
  
      // Set the response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'inline; filename=contacts.xlsx');
  
      // Send the Excel file buffer as the response
      res.send(fileBuffer);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error");
    }
  });

app.use(express.static(path.join(__dirname,'../build')));

app.post('*', function(_,res){
  res.sendFile(
      path.join(__dirname,"./client/build/index.html"),
      function(err){
          res.status(500).send(err);
      }
  );
});

const server = app.listen(port, function(req,res){
    console.log(`The server running at http://localhost:${port}`)
})