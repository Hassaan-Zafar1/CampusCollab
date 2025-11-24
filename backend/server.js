const express = require('express');
   const cors = require('cors');
   require('dotenv').config();

   const app = express();
   
   app.use(cors());
   app.use(express.json());
   app.use(express.urlencoded({ extended: false }));

   app.get('/', (req, res) => {
     res.json({ message: 'CampusCollab API is running!' });
   });

   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });

const connectDB = require('./config/db');
connectDB();

const authRoutes = require('./routes/authroutes');
   app.use('/api/auth', authRoutes);

const projectRoutes = require('./routes/projectRoutes');
   app.use('/api/projects', projectRoutes);

const applicationRoutes = require('./routes/applicationRoutes');
   app.use('/api/applications', applicationRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

const recommendationRoutes = require('./routes/recommendationRoutes');
   app.use('/api/recommendations', recommendationRoutes);