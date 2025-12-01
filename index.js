const express = require('express');
const expressApp = express();
const PORT = process.env.PORT || 8000;


expressApp.listen(PORT, () => {
    console.log(`Server is listening to ${PORT}`)
})