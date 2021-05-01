const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = Router();

router.post(
	'/register',
	[
		check('email')
			.isEmail().withMessage('Некорректный email')
			.exists().withMessage('Введите email'),
		check('username')
			.isLength({ min: 3 }).withMessage('Слишком короткое имя')
			.isLength({ max: 16}).withMessage('Слишком длинное имя')
			.exists().withMessage('Введите имя'),
		check('password')
			.isLength({ min: 6 }).withMessage('Слишком короткий пароль')
			.exists().withMessage('Введите пароль')
	],
	async (req, res) => {
	try	{
		const errors = validationResult(req);

		if(!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array });
		}

		const { email, username, password } = req.body;

		const candidateEmail = await User.findOne({ email });
		const candidateUsername = await User.findOne({ username });

		if(candidateEmail || candidateUsername) {
			return res.status(400).json({ message: 'Такой пользовтель уже существует' });
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const health = 100;
		const starve = 100;
		const stamina = 100;
		const money = 0;
		const role = 'user';
		const rating = 0;

		const user = new User({ email, username, password: hashedPassword, health, starve, stamina, money, role, rating });

		await user.save();

		res.status(201).json({ message: 'Пользователь создан' });
	} catch(e) {
		res.status(500).json({ message: 'Что-то пошло не так' });
	}
});

router.post(
	'/login',
	[
		check('username')
			.isLength({ min: 3 }).withMessage('Слишком короткое имя')
			.isLength({ max: 16}).withMessage('Слишком длинное имя')
			.exists().withMessage('Введите имя'),
		check('password')
			.isLength({ min: 6 }).withMessage('Слишком короткий пароль')
			.exists().withMessage('Введите пароль')
	],
	async (req, res) => {
	try	{
		const errors = validationResult(req);

		if(!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array });
		}

		const { username, password } = req.body;

		const user = await User.findOne({ username });

		if(!user) {
			return res.status(400).json({ message: 'Неверное имя' });
		}

		const isMatch = await bcrypt.compare(password, user.password);

	    if (!isMatch) {
	      return res.status(400).json({ message: 'Неверный пароль' })
	    }

	    res.status(200).json({ user });
	} catch(e) {
		res.status(500).json({ message: 'Что-то пошло не так' });
	}
});

module.exports = router;