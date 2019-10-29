import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    try {
      const plan = await Plan.findAll();

      return res.status(200).json(plan);
    } catch (error) {
      return res.status(400).json({ error: 'Search failed.' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const plansExists = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (plansExists) {
      return res.status(400).json({ error: 'Plans already exists' });
    }

    try {
      const plan = await Plan.create(req.body);

      return res.status(200).json(plan);
    } catch (error) {
      return res.status(400).json({ error: 'Create failed.' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number()
        .integer()
        .positive(),
      price: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { title } = req.body;
    const { id } = req.params;

    const plan = await Plan.findByPk(id);

    if (title !== plan.title) {
      const plansExists = await Plan.findOne({
        where: { title },
      });

      if (plansExists) {
        return res.status(400).json({ error: 'Plan already exist' });
      }
    }

    const { duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async destroy(req, res) {
    const { id } = req.params;
    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan not found.' });
    }

    try {
      await plan.destroy(id);

      return res.status(200).json({ sucess: 'Plan deleted with sucess.' });
    } catch (error) {
      return res.json(400).json({ error: 'Plan delete failed.' });
    }
  }
}

export default new PlanController();
