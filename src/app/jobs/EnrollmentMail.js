import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { enrollmentFromMail } = data;

    await Mail.sendMail({
      to: `${enrollmentFromMail.student.name} <${enrollmentFromMail.student.email}>`,
      subject: 'Sua matricula foi realizada com sucesso',
      template: 'enrollment',
      context: {
        student: enrollmentFromMail.student.name,
        plan: enrollmentFromMail.plan.title,
        price: enrollmentFromMail.price,
        duration: enrollmentFromMail.plan.duration,
        date_start: format(
          parseISO(enrollmentFromMail.start_date),
          "dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        date_end: format(
          parseISO(enrollmentFromMail.end_date),
          "dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new EnrollmentMail();
