import baseDayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import calendar from 'dayjs/plugin/calendar';
import duration from 'dayjs/plugin/duration';

baseDayjs.extend(relativeTime);
baseDayjs.extend(utc);
baseDayjs.extend(timezone);
baseDayjs.extend(calendar);
baseDayjs.extend(duration);

const timezoneName = baseDayjs.tz.guess();
const locale = Intl.DateTimeFormat().resolvedOptions().locale;

baseDayjs.tz.setDefault(timezoneName);
baseDayjs.locale(locale);

const dayjs = baseDayjs;

export default dayjs;
