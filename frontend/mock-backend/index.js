// const express = require('express');
// const app = express();
// const port = 3001;
//
// app.use(express.json());
//
// app.get('/user', (req, res) => {
//     res.json({ message: 'User management mock service' });
// });
//
// app.listen(port, () => {
//     console.log(`Mock User management service is running on port ${port}`);
// });
//
// // Δημιουργία mock υπηρεσιών για τα άλλα services
//
// const problemApp = express();
// problemApp.use(express.json());
//
// problemApp.get('/problem', (req, res) => {
//     res.json({ message: 'Problem management mock service' });
// });
//
// problemApp.listen(3002, () => {
//     console.log(`Mock Problem management service is running on port 3002`);
// });
//
//
// const transactionApp = express();
// transactionApp.use(express.json());
//
// transactionApp.get('/transaction', (req, res) => {
//     res.json({ message: 'Transaction management mock service' });
// });
//
// transactionApp.listen(3003, () => {
//     console.log(`Mock Transaction management service is running on port 3003`);
// });
//
// const solverApp = express();
//
// solverApp.use(express.json());
//
// solverApp.get('/solver', (req, res) => {
//     res.json({ message: 'Solver management mock service' });
// });
//
// solverApp.listen(3004, () => {
//     console.log(`Mock Solver management service is running on port 3004`);
// });

const express = require('express');

const app = express();
const port = 3001;

app.use(express.json());

app.get('/user', (req, res) => {
    res.json({ message: 'User management mock service' });
});

app.listen(port, () => {
    console.log(`Mock User management service is running on port ${port}`);
});

// Δημιουργία mock υπηρεσιών για τα άλλα services
const problemApp = express();
const transactionApp = express();
const solverApp = express();

problemApp.use(express.json());
transactionApp.use(express.json());
solverApp.use(express.json());

problemApp.get('/problem', (req, res) => {
    res.json({ message: 'Problem management mock service' });
});

transactionApp.get('/transaction', (req, res) => {
    res.json({ message: 'Transaction management mock service' });
});

solverApp.get('/solver', (req, res) => {
    res.json({ message: 'Solver management mock service' });
});

problemApp.listen(3002, () => {
    console.log(`Mock Problem management service is running on port 3002`);
});

transactionApp.listen(3003, () => {
    console.log(`Mock Transaction management service is running on port 3003`);
});

solverApp.listen(3004, () => {
    console.log(`Mock Solver management service is running on port 3004`);
});
