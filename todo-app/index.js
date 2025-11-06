const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('<h1>Todo App</h1><p>App is under construction</p>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});