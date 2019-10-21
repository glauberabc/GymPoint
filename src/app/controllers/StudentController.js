import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    try {
      const student = await Student.findAll();

      return res.status(200).json(student);
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
      age: Yup.number()
        .integer()
        .positive()
        .required(),
      height: Yup.number()
        .positive()
        .required(),
      weight: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentsExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentsExists) {
      return res.status(400).json({ error: 'Students already exists' });
    }

    try {
      const student = await Student.create(req.body);

      return res.status(200).json(student);
    } catch (error) {
      return res.status(400).json({ error: 'Create failed.' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number()
        .integer()
        .positive(),
      height: Yup.number().positive(),
      weight: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (email !== student.email) {
      const studentsExists = await Student.findOne({
        where: { email },
      });

      if (studentsExists) {
        return res.status(400).json({ error: 'Student already exist' });
      }
    }

    const { name, age, weight, height } = await student.update(req.body);

    return res.json({
      id,
      name,
      email,
      age,
      height,
      weight,
    });
  }

  async destroy(req, res) {
    const { id } = req.params;
    const user = await Student.findByPk(id);

    if (!user) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    try {
      await user.destroy(id);

      return res.status(200).json({ sucess: 'Student deleted with sucess.' });
    } catch (error) {
      return res.json(400).json({ erro: 'Student delete failed.' });
    }
  }
}

export default new StudentController();
