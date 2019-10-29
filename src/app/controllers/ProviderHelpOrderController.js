import { format } from 'date-fns';

import pt from 'date-fns/locale/pt';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import HelpOrderAnswerMail from '../jobs/HelpOrderAnswerMail';
import Queue from '../../lib/Queue';
import Notification from '../schema/Notification';

class ProviderHelpOrderController {
  async index(req, res) {
    const page = 1;
    const quantity = 20;

    const helpOrders = await HelpOrder.findAll({
      where: { answer: null },
      limit: quantity,
      offset: (page - 1) * quantity,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const { id } = req.params;
    const { answer } = req.body;

    // Check if the student is able to enter gym
    const helpOrder = await HelpOrder.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!helpOrder) {
      return res.status(401).json({ error: 'Help order not exists' });
    }

    helpOrder.answer = answer;
    helpOrder.answer_at = new Date();

    await helpOrder.save();

    await Queue.add(HelpOrderAnswerMail.key, {
      helpOrder,
    });

    /**
     * Notify appointment provider
     */
    const formattedDate = format(
      helpOrder.answer_at,
      "dd 'de' MMMM', às' H:mm'h'",
      {
        locale: pt,
      }
    );

    await Notification.create({
      content: `Olá ${helpOrder.student.name}, seu pedido de auxílio foi respondido, nessa data: ${formattedDate}`,
      user: helpOrder.student.id,
    });

    return res.json(helpOrder);
  }
}

export default new ProviderHelpOrderController();
