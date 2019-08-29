import { Model, Sequelize } from 'sequelize';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        location: Sequelize.STRING,
        schedule: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
  }
}

export default Meetup;
