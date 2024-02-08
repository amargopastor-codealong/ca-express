const express = require('express');
const app = express();

const requestLogger = (request, response, next) => {
	console.log('🚀 Method:', request.method);
	console.log('🤖 Path:  ', request.path);
	console.log('🐒 Body:  ', request.body);
	console.log('---');
	next();
};

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(express.json());
app.use(requestLogger);

const houses = [
	{
		id: '1',
		name: 'Griffindor',
		points: 14,
	},
	{
		id: '2',
		name: 'Slytherin',
		points: 14,
	},
	{
		id: '3',
		name: 'Ravenclaw',
		points: 17,
	},
	{
		id: '4',
		name: 'Hufflepuff',
		points: 25,
	},
];

app.get('/', (request, response) => {
	response.send('<h1>Hello Potter!</h1>');
});

app.get('/api/houses', (request, response) => {
	response.json(houses);
});

app.get('/api/houses/:id', (request, response, next) => {
	const id = request.params.id;
	const house = houses.find((house) => house.id === id);
	// house ? response.json(house) : response.status(404).end();
	// house ? response.json(house) : response.status(400).send('Go home, muggle!');
	house ? response.json(house) : next();
});

app.delete('/api/houses/:id', (request, response) => {
	const id = Number(request.params.id);
	const house = houses.filter((house) => house.id !== id);

	response.status(204).end();
});

const generateId = () => {
	const maxId = houses.length > 0 ? Math.max(...houses.map((n) => n.id)) : 0;
	return maxId + 1;
};

app.post('/api/houses', (request, response) => {
	const body = request.body;
	console.log('body', body);

	if (!body.name) {
		return response.status(400).json({
			error: 'content missing',
		});
	}
	const newHouse = {
		name: body.name,
		points: 0,
		id: generateId(),
	};

	console.log('newHouse', newHouse);
	response.json(newHouse);
});

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
