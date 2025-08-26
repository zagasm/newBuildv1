import React from 'react';
import moment from 'moment';

const TimeAgo = ({ date }) => {
    const getTimeAgo = (date) => {
        const now = moment();
        const then = moment(date);
        const duration = moment.duration(now.diff(then));

        const minutes = duration.asMinutes();
        const hours = duration.asHours();
        const days = duration.asDays();
        const years = duration.asYears();

        if (minutes < 1) {
            return "just now";
        } else if (minutes < 60) {
            return `${Math.floor(minutes)} minute${Math.floor(minutes) !== 1 ? 's' : ''} ago`;
        } else if (hours < 24) {
            return `${Math.floor(hours)} hour${Math.floor(hours) !== 1 ? 's' : ''} ago`;
        } else if (days < 365) {
            return `${Math.floor(days)} day${Math.floor(days) !== 1 ? 's' : ''} ago`;
        } else {
            return `${Math.floor(years)} year${Math.floor(years) !== 1 ? 's' : ''} ago`;
        }
    };

    return getTimeAgo(date);
};

export default TimeAgo;
