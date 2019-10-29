import * as Yup from 'yup';
import {
  startOfHour,
  parseISO,
  isBefore,
  addMonths,
  format,
  // subHours,
} from 'date-fns';
import pt from 'date-fns/locale/pt';
import Student from '../models/Student';
// import File from '../models/File';
import Plan from '../models/Plan';
import Enrollment from '../models/Enrollment';
import Notification from '../schema/Notification';

import EnrollmentMail from '../jobs/EnrollmentMail';
import Queue from '../../lib/Queue';

class EnrollmentController {
  async index(req, res) {
    const { quantity = 20, page } = req.query;

    const enrollments = await Enrollment.findAll({
      order: ['start_date'],
      attributes: ['id', 'start_date', 'end_date', 'price'],
      limit: quantity,
      offset: (page - 1) * quantity,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
          // include: [
          //   {
          //     model: File,
          //     as: 'avatar',
          //     attributes: ['id', 'path', 'url'],
          //   },
          // ],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration'],
        },
      ],
    });

    return res.json(enrollments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { student_id, plan_id, start_date } = req.body;

    /**
     * Verifica se o estudante existe
     */
    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.status(401).json({ error: 'Student does not exist.' });
    }

    /**
     * Verifica se o plano existe
     */
    const planExists = await Plan.findByPk(plan_id);

    if (!planExists) {
      return res.status(401).json({ error: 'Plan does not exist.' });
    }

    /**
     * Verifica se a data informada é anterior a data atual
     */
    const hourStart = startOfHour(parseISO(start_date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    /**
     * Verifica se o estudante já tem uma matricula
     */
    const checkExistEnrollment = await Enrollment.findOne({
      where: {
        student_id,
      },
    });

    if (checkExistEnrollment) {
      return res.status(400).json({ Error: 'Student is already enrolled' });
    }

    /**
     * Calcula o valor total da matricula
     */
    const price = Number(planExists.price) * Number(planExists.duration);

    /**
     * Calcula a nova data de encerramento
     */
    const end_date = addMonths(
      parseISO(start_date),
      Number(planExists.duration)
    );

    /**
     * Cria a matricula
     */
    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      price,
      start_date,
      end_date,
    });

    const enrollmentFromMail = await Enrollment.findByPk(enrollment.id, {
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration'],
        },
      ],
    });

    if (!enrollmentFromMail) {
      return res.status(401).json({ error: 'Enrollment not exists' });
    }

    await Queue.add(EnrollmentMail.key, {
      enrollmentFromMail,
    });

    /**
     * Notify appointment provider
     */
    const formattedDate = format(
      enrollmentFromMail.end_date,
      "dd 'de' MMMM', às' H:mm'h'",
      {
        locale: pt,
      }
    );

    await Notification.create({
      content: `Seja bem vindo ${enrollmentFromMail.student.name}, sua matrícula termina no dia ${formattedDate}`,
      user: student_id,
    });

    return res.json(enrollmentFromMail);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number()
        .integer()
        .positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { plan_id } = req.body;
    const new_price = req.body.price;
    const { id } = req.params;

    const enrollmentExists = await Enrollment.findByPk(id);

    /**
     * Verifica se a matricula existe
     */
    if (!enrollmentExists) {
      return res.status(400).json({ error: 'This enrollment does not exist' });
    }

    const { start_date } = enrollmentExists;

    /**
     * Verifica se o id do novo plano foi informado
     * e se ele é diferente do plano atual
     */
    if (plan_id && plan_id === enrollmentExists.plan_id) {
      return res
        .status(400)
        .json({ error: 'This is already the current plan of this enrollment' });
    }

    /**
     * Carrega os dados do novo plano
     */
    const plan = await Plan.findByPk(plan_id);

    /**
     * Calcula o novo price e end_date
     */
    let price = Number(plan.price) * Number(plan.duration);
    const end_date = addMonths(start_date, Number(plan.duration));

    /**
     * Se foi informado para atualizar um novo price, usa ele como price final
     */
    if (new_price && new_price > 0) {
      price = new_price;
    }

    /**
     * Atualiza os dados
     */

    const { student_id } = await enrollmentExists.update({
      plan_id,
      price,
      end_date,
    });

    return res.json({
      id,
      student_id,
      plan_id,
      price,
      start_date,
      end_date,
    });
  }

  async destroy(req, res) {
    const { id } = req.params;
    const enrollmentExists = await Enrollment.findByPk(id);

    if (!enrollmentExists) {
      return res.status(400).json({ error: 'Enrollment not found.' });
    }

    try {
      await enrollmentExists.destroy(id);

      return res
        .status(200)
        .json({ sucess: 'Enrollment deleted with sucess.' });
    } catch (error) {
      return res.json(400).json({ error: 'Enrollment delete failed.' });
    }
  }
}

export default new EnrollmentController();
