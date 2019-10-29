import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class UserController {
  async index(req, res) {
    try {
      const user = await User.findAll({
        attributes: ['id', 'name', 'email', 'avatar_id'],
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['name', 'path', 'url'],
          },
        ],
      });

      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ error: 'Search failed.' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, administrator } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      administrator,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword, password } = req.body;
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (user.administrator) {
      return res.status(400).json({ error: 'Unable to update admin user' });
    }

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(401).json({ erro: 'User already exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    if (oldPassword && oldPassword === password) {
      return res
        .status(401)
        .json({ error: 'New password must be different from previous one' });
    }

    const { name, administrator } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      administrator,
    });
  }

  async destroy(req, res) {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    if (user.administrator) {
      return res.status(400).json({ error: 'Unable to delete admin user' });
    }

    try {
      await user.destroy(id);

      return res.status(200).json({ sucess: 'User deleted with sucess.' });
    } catch (error) {
      return res.json(400).json({ error: 'User delete failed.' });
    }
  }
}

export default new UserController();
