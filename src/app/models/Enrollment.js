import Sequelize, { Model } from 'sequelize';

class Enrollment extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(model) {
    this.belongsTo(model.Student, { foreignKey: 'student_id', as: 'student' });
    this.belongsTo(model.Plan, { foreignKey: 'plan_id', as: 'plan' });
  }
}

export default Enrollment;
