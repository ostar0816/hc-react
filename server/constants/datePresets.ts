import moment from 'moment';

export default {
  TODAY: {
    getDbRange: () => {
      return { start: moment().startOf('day'), end: moment().endOf('day') };
    },
  },
  YESTERDAY: {
    getDbRange: () => {
      return {
        start: moment()
          .subtract(1, 'd')
          .startOf('day'),
        end: moment()
          .subtract(1, 'd')
          .endOf('day'),
      };
    },
  },
  LAST_2DAYS: {
    getDbRange: () => {
      return {
        start: moment()
        .subtract(1, 'd')
        .startOf('day'),
        end: moment()
        .endOf('day'),
      };
    },
  },
  LAST_7DAYS: {
    getDbRange: () => {
      return {
        start: moment()
          .subtract(6, 'd')
          .startOf('day'),
        end: moment()
        .endOf('day'),
      };
    },
  },
  LAST_30DAYS: {
    getDbRange: () => {
      return {
        start: moment()
        .subtract(30, 'd')
        .startOf('day'),
        end: moment()
        .endOf('day'),
      };
    },
  },
  LAST_30MINS: {
    getDbRange: () => {
      return {
        start: moment().subtract(30, 'm'),
        end: moment(),
      };
    },
  },
  LAST_1HOUR: {
    getDbRange: () => {
      return {
        start: moment().subtract(1, 'h'),
        end: moment(),
      };
    },
  },
  LAST_2HOURS: {
    getDbRange: () => {
      return {
        start: moment().subtract(2, 'h'),
        end: moment(),
      };
    },
  },
  LAST_3HOURS: {
    getDbRange: () => {
      return {
        start: moment().subtract(3, 'h'),
        end: moment(),
      };
    },
  },
  LAST_6HOURS: {
    getDbRange: () => {
      return {
        start: moment().subtract(6, 'h'),
        end: moment(),
      };
    },
  },
  LAST_12HOURS: {
    getDbRange: () => {
      return {
        start: moment().subtract(12, 'h'),
        end: moment(),
      };
    },
  },
  LAST_24HOURS: {
    getDbRange: () => {
      return {
        start: moment().subtract(24, 'h'),
        end: moment(),
      };
    },
  },





};
