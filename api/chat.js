const { Router } = require('express');
const Message = require('../models/Message');
const User = require('../models/User');

const router = Router();

router.post('/send', async (req, res) => {
	try {
		const { userId, username, text, date } = req.body;
		const sender = await User.findById(userId);

		if(sender) {
			const message = new Message({ userId, username, text, date });

			await message.save();
		} else {
			return res.status(400).json({ message: 'Пользователь не найден' });
		}
	} catch(e) {
		res.status(500).json({ message: 'Что-то пошло не так' });
	}
});

router.get('/show', async (req, res) => {
	try	{
		return res.json({ messages: await Message.find({}) });
	} catch(e) {
		res.status(500).json({ message: 'Что-то пошло не так' });
	}
});

module.exports = router;