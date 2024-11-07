import React, { useState } from 'react';
import axios from 'axios';
import './FindCalories.css';


const FindCalories = () => {
  const [exerciseQuery, setExerciseQuery] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState(null);
  const [error, setError] = useState('');

  // Define your API credentials
  const apiKey = '60f0736abdb11bb951bdeb4cf660a8a6';  // Replace with your Nutritionix API Key
  const apiId = '355ea952';    // Replace with your Nutritionix App ID

  // Handle the calorie search
  const handleSearch = async () => {
    if (!exerciseQuery || !age || !weight || !gender) {
      setError('Please provide all the details');
      return;
    }

    setError('');
    setCaloriesBurned(null);

    try {
      // Make a POST request to Nutritionix API's natural/exercise endpoint
      const response = await axios.post(
        'https://trackapi.nutritionix.com/v2/natural/exercise',
        { 
          query: exerciseQuery 
        },
        {
          headers: {
            'x-app-id': apiId, 
            'x-app-key': apiKey,
            'Content-Type': 'application/json',
          },
          params: {
            age,
            weight,
            gender,
          },
        }
      );

      const data = response.data;

      // Check if exercise info is found
      if (data.exercises && data.exercises.length > 0) {
        setCaloriesBurned(data.exercises[0].nf_calories);
      } else {
        setError('No exercise data found.');
      }
    } catch (err) {
      setError('Error fetching data.');
      console.error(err);
    }
  };

  return (
    <div className="find-calories-container">
      <h2>Find Calories Burned</h2>
      <input
        type="text"
        placeholder="Enter your exercise (e.g., ran for 30 minutes)"
        value={exerciseQuery}
        onChange={(e) => setExerciseQuery(e.target.value)}
      />
      <input
        type="number"
        placeholder="Enter your age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <input
        type="number"
        placeholder="Enter your weight (in kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <button onClick={handleSearch}>Find Calories</button>

      {error && <p className="error">{error}</p>}

      {caloriesBurned && (
        <div className="calories-result">
          <h3>Calories Burned: {caloriesBurned} kcal</h3>
        </div>
      )}
    </div>
  );
};

export default FindCalories;
