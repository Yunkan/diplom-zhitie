const { Router } = require('express');
const User = require('../models/User');

const router = Router();

router.post('/update', async (req, res) => {
	try {
		const { userId, stats } = req.body;

		const user = await User.findById(userId);

		let updatingStat = { health: user['health'] };

		stats.forEach(stat => {
			if((stat.name === 'starve' || stat.name === 'stamina') && user[stat.name] + stat.value < 0)
				updatingStat['health'] -= 1; 

			if(stat.name !== 'money' && stat.name !== 'rating' && user[stat.name] + stat.value > 100) {
				updatingStat[stat.name] = 100;
			} else {
				if(stat.name !== 'rating' && user[stat.name] + stat.value < 0) {
					updatingStat[stat.name] = 0;
				} else {
					updatingStat[stat.name] = user[stat.name] + stat.value;
				}
			}
		});

		await User.findOneAndUpdate({ _id: userId }, updatingStat);

		const updatedUser = await User.findById(userId);

		res.json({ user: updatedUser });
	} catch(e) {
		res.status(500).json({ message: 'Что-то пошло не так', e: e.message });
	}
});

router.get('/showAllUsers', async (req, res) => {
	try {
		const users = await User.find({}).sort('-rating').limit(10);

		res.json({ users });
	} catch(e) {
		res.status(500).json({ message: 'Что-то пошло не так', e: e.message });
	}
});

router.get('/reborne/:id', async (req, res) => {
	try {
		await User.findOneAndUpdate({ _id: req.params.id }, {
			health: 100,
			starve: 100,
			stamina: 100,
			money: 0,
			rating: 0,
		});

		const user = await User.findById(req.params.id);

		res.json({ user });
	} catch(e) {
		res.status(500).json({ message: 'Что-то пошло не так', e: e.message });
	}
});

module.exports = router;