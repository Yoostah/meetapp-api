import * as Yup from 'yup';
import { isBefore } from 'date-fns';
import { Op } from 'sequelize';
import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Mail from '../../lib/Mail';

class SubscriptionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
      meetup_id: Yup.number().required(),
    });

    if (!schema.isValid()) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const meetup = await Meetup.findOne({
      where: {
        id: req.body.meetup_id,
      },
      include: [
        {
          model: User,
          as: 'owner',
        },
      ],
    });
    if (!meetup) {
      return res.status(400).json({ error: 'Meetup not found!' });
    }
    /**
     * Check if the user is not owner of meetup
     */
    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: "Can't subscript in your own meetups " });
    }
    /**
     * Check if the meetup has been happened
     */
    if (isBefore(meetup.schedule, new Date())) {
      return res.status(400).json({ error: "Can't subscript past meetups" });
    }

    const subs = await Subscription.findOne({
      where: {
        user_id: req.userId,
        meetup_id: req.body.meetup_id,
      },
    });
    /**
     * Check if user has been signed for the meetup
     */
    if (subs) {
      return res
        .status(400)
        .json({ error: 'You already signed up for this meetup!' });
    }
    const subHour = await Subscription.findOne({
      where: {
        [Op.and]: [{ '$Meetup.schedule$': meetup.schedule }],
        user_id: req.userId,
      },
      include: [Meetup],
    });
    /**
     * Check if the user already signed up for a meetup in this hour
     */
    if (subHour) {
      return res
        .status(400)
        .json({ err: 'You already signed up for one meetup in this hour' });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: req.body.meetup_id,
    });
    const user = await User.findByPk(req.userId);

    await Mail.sendMail({
      to: `${meetup.owner.name} <${meetup.owner.email}>`,
      subject: 'Mais um inscrito para o seu Meetup',
      text: `o Usuário ${user.name} acabou de se cadastrar no seu Meetup =)`,
    });
    return res.send(subscription);
  }

  async show(req, res) {
    const sub = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [Meetup],
    });
    return res.send(sub);
  }
}

export default new SubscriptionController();
