const express = require('express');
const app = express();
const sequelize = require('./config/database');
const vehicleRoutes = require('./routes/vehicleRoutes');
const chatRoutes = require('./routes/chatRoutes');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // folder frontend

app.use('/api/vehicles', vehicleRoutes);
app.use('/api', chatRoutes);

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
.then(()=>{ 
  console.log('DB connected'); 
  app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`)); 
})
.catch(err=>console.error(err));
