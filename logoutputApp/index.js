const RANDOM_STRING = Math.random().toString(36).substring(2, 8);

console.log(`App started. Random string: ${RANDOM_STRING}`);

setInterval(() => {
  console.log(`${new Date().toISOString()}: ${RANDOM_STRING}`);
}, 5000);
