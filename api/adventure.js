const { Router } = require('express');
const User = require('../models/User');
const Adventure = require('../models/adventure');

const router = Router();

router.post('/create', async (req, res) => {
	try {
		const { _id, text, health, starve, stamina, money, rating } = req.body;

		if(_id) {
			await Adventure.findOneAndUpdate({ _id }, {
				text, health, starve, stamina, money, rating
			});
		} else {
			const adventure = new Adventure({ text, health, starve, stamina, money, rating });

			await adventure.save();

			res.status(201).json({ message: 'Приключение создано', adventure });
		}
	} catch(e) {
		res.status(500).json({ message: 'Что-то пошло не так...', e: e.message });
	}
});

router.get('/showAdventuresList', async (req, res) => {
	const adventuresList = await Adventure.find({});

	res.json({ adventuresList });
});

router.post('/delete', async (req, res) => {
	try	{
		const { _id, text, health, starve, stamina, money, rating } = req.body;

		const adv = await Adventure.findById(_id);

		await Adventure.deleteOne({ _id });

		res.end();
	} catch(e) {
		res.status(500).json({ message: 'Что-то пошло не так...', e: e.message });
	}
});

router.get('/show', async (req, res) => {
	const documentsCount = await Adventure.countDocuments();
	const random = ~~(Math.random() * documentsCount);
	const adventure = await Adventure.findOne().skip(random);

	res.json({ adventure });
});

module.exports = router;