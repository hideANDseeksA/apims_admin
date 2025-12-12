// makeData.js

// List of US states for random selection
export const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

// Function to generate random number between min and max
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate fake data for testing
export const fakeData = Array.from({ length: 50 }, (_, idx) => ({
  id: idx + 1,
  name: `Person ${idx + 1}`,
  age: randomInt(18, 65),
  state: usStates[randomInt(0, usStates.length - 1)],
  email: `person${idx + 1}@example.com`,
}));
