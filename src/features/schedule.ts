import { format } from 'date-fns';
import { Telegraf } from 'telegraf';

const MAIN_CHANNEL = process.env.MAIN_CHANNEL || 0;

const birthdayList = [
  { day: '06-01', name: 'Pipi' },
  { day: '21-01', name: 'Alan' },
  { day: '10-02', name: 'Facu' },
  { day: '27-02', name: 'Ine' },
  { day: '03-03', name: 'Agus' },
  { day: '22-03', name: 'Espi' },
  { day: '19-05', name: 'Jota' },
  { day: '26-05', name: 'Dan' },
  { day: '06-06', name: 'Sir' },
  { day: '16-07', name: 'Saba' },
  { day: '12-09', name: 'Lean' },
  { day: '25-09', name: 'Maru' },
  { day: '05-11', name: 'Marki' },
  { day: '21-11', name: 'Ana' },
];

const sendRegards = (bot: Telegraf) => {
  const today = format(new Date(), 'dd-MM');
  const birthdays = birthdayList.filter(b => b.day === today);
  birthdays.forEach((birthday) => {
    bot.telegram.sendMessage(MAIN_CHANNEL, `Feliz cumple ${birthday.name}`);
  });
};

const Schedule = { sendRegards };

export default Schedule;
