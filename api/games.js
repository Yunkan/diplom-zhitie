const { Router } = require('express');
const Game = require('../models/Game');

const router = Router();

router.post('/create', async (req, res) => {
	try {
		const { gameType, creater } = req.body;

		const game = new Game({ gameType, creater, userAmount: 1 });

		await game.save();

		res.json({ game });
	} catch(e) {
		res.status(500).json({ message: 'Что-то пошло не так' });
	}
});

router.get('/show', async (req, res) => {
	try {
		const games = await Game.find({ userAmount: { $lt: 2 } });

		res.json({ games });
	} catch(e) {
		res.status(500).json({ message: 'Что-то пошло не так', e: e.message });
	}
});

module.exports = router;