import { app } from '../servers';

app.get('/', (req, res) => {
    res.json('hello wolrd');
});

export default app;
