import React from 'react';

import css from './DateRangePickerCustom.lessx';

import { Button, Input, DatePicker, Checkbox } from 'antd';
import moment from 'moment';
const RangePicker = DatePicker.RangePicker;
const CheckboxGroup = Checkbox.Group;

import DatePresets from '../../../server/constants/datePresets';

type DateRangePickerCustomProps = {
  size?: 'large' | 'default' | 'small';
  type?: string;
  startDate?: string;
  endDate?: string;
  datePreset?: string;
  onChange(typeOfRange: string, dateRange: any): void;
};
const initialState = {
  datePickerOpen: false,
  checkedList: [],
};
type DateRangePickerCustomState = Readonly<typeof initialState>;

class DateRangePickerCustom extends React.Component<
  DateRangePickerCustomProps,
  DateRangePickerCustomState
> {
  state = initialState;

  static defaultProps = {
    size: 'small',
    // value: 'YESTERDAY',
    // value: ['2018/04/25', '2018/05/25'],
  };

  DATE_FORMAT: string = 'YYYY-MM-DD';
  DATE_RANGE_NAMES: any = {
    TODAY: 'Today',
    YESTERDAY: 'Yesterday',
    LAST_2DAYS: 'Last 2 Days',
    LAST_7DAYS: 'Last 7 Days',
    LAST_30DAYS: 'Last 30 Days',
  };
  TIME_RANGE_NAMES: any = {
    LAST_30MINS: 'Last 30 Mins',
    LAST_1HOUR: 'Last 1 Hrs',
    LAST_2HOURS: 'Last 2 Hrs',
    LAST_3HOURS: 'Last 3 Hrs',
    LAST_6HOURS: 'Last 6 Hrs',
    LAST_12HOURS: 'Last 12 Hrs',
  };
  DAY_OF_WEEK: any = {
    MON: 'Monday',
    TUE: 'Tuesday',
    WED: 'Wednesday',
    THU: 'Thursday',
    FRI: 'Friday',
    SAT: 'Saturday',
    SUN: 'Sunday',
  };

  getDateRange = (RANGE_NAME: any) => {
    return DatePresets[RANGE_NAME].getDbRange();
  };

  handleDateRangeClick = (DATE_RANGE: any) => {
    this.setState({
      datePickerOpen: false,
    });

    this.props.onChange('DATE_PRESET', { datePreset: DATE_RANGE });
  };
  handleDateRangeChange = (dates: any[], dateStrings: string[]) => {
    this.props.onChange('DATE_RANGE', { startDate: dateStrings[0], endDate: dateStrings[1] });
  };
  handleDateRangeOpenChange = (status: boolean) => {
    this.setState({
      datePickerOpen: status,
    });
  };
  handleCheckboxChange = (checkedList: string[]) => {
    this.setState({
      checkedList,
    });
  };

  render() {
    const { size, type, startDate, endDate, datePreset } = this.props;

    const selectedDateRange =
      type === 'DATE_RANGE'
        ? { start: startDate, end: endDate }
        : type === 'DATE_PRESET'
          ? this.getDateRange(datePreset)
          : {};

    const selectedRangeName =
      (type && type === 'DATE_PRESET' && this.DATE_RANGE_NAMES[datePreset]) ||
      this.TIME_RANGE_NAMES[datePreset];
    const { datePickerOpen } = this.state;

    const dateButtonsNode: JSX.Element[] = [];
    const timeButtonsNode: JSX.Element[] = [];
    Object.keys(this.DATE_RANGE_NAMES).forEach(key => {
      dateButtonsNode.push(
        <div key={key}>
          <Button
            type={this.DATE_RANGE_NAMES[key] === selectedRangeName ? 'primary' : null}
            size="small"
            onClick={() => this.handleDateRangeClick(key)}
          >
            {this.DATE_RANGE_NAMES[key]}
          </Button>
        </div>,
      );
    });
    Object.keys(this.TIME_RANGE_NAMES).forEach(key => {
      timeButtonsNode.push(
        <div key={key}>
          <Button
            type={this.TIME_RANGE_NAMES[key] === selectedRangeName ? 'primary' : null}
            size="small"
            onClick={() => this.handleDateRangeClick(key)}
          >
            {this.TIME_RANGE_NAMES[key]}
          </Button>
        </div>,
      );
    });
    const dayWeekCheckbuttonList: any[] = [];
    Object.keys(this.DAY_OF_WEEK).forEach(key => {
      dayWeekCheckbuttonList.push({ value: key, label: this.DAY_OF_WEEK[key] });
    });

    return (
      <div className={css.rangePicker}>
        {selectedRangeName ? (
          <Input size={size} value={selectedRangeName} className={css.input} readOnly />
        ) : null}
        <RangePicker
          open={datePickerOpen}
          size={size}
          value={
            selectedDateRange.start && selectedDateRange.end
              ? [
                  moment(selectedDateRange.start, this.DATE_FORMAT),
                  moment(selectedDateRange.end, this.DATE_FORMAT),
                ]
              : undefined
          }
          format={this.DATE_FORMAT}
          renderExtraFooter={() => (
            <div className={css.footer}>
              <div>{timeButtonsNode}</div>
              <div>{dateButtonsNode}</div>
              <div>
                <div>
                  {/*
                  <CheckboxGroup
                    options={dayWeekCheckbuttonList}
                    value={this.state.checkedList}
                    onChange={this.handleCheckboxChange}
                  />
                */}
                </div>
              </div>
            </div>
          )}
          onChange={this.handleDateRangeChange}
          onOpenChange={this.handleDateRangeOpenChange}
        />
      </div>
    );
  }
}

export default DateRangePickerCustom;
