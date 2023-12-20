const express = require('express');
const admin = require('firebase-admin');

const serviceAccount = require('./kurudhi-6135d-firebase-adminsdk-d1cda-43545371c4.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://kurudhi-6135d-default-rtdb.asia-southeast1.firebasedatabase.app/',
});

const app = express();
const port = 3001;

app.get('/bloodDonors', async (req, res) => {
    const { city } = req.query;
  
    if (!city) {
      return res.status(400).json({ error: 'City is a required parameter' });
    }
  
    const donorsRef = admin.database().ref('users');
  
    try {
      const snapshot = await donorsRef.orderByChild('city').equalTo(city).once('value');
  
      const result = [];
  
      snapshot.forEach(donorSnapshot => {
        const donor = donorSnapshot.val();
        result.push({
          fullName: donor.fullName,
          city: donor.city,
          bloodGroup: donor.bloodGroup,
        });
      });
  
      res.json(result);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
