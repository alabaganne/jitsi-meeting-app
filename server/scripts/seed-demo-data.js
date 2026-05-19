#!/usr/bin/env node
const { demoUsers, demoMeetings } = require("../data/demoData");

console.log("Demo seed data is loaded automatically when the API starts.");
console.log(`Users: ${demoUsers.length}`);
console.table(
    demoUsers.map(({ name, username, email, password }) => ({
        name,
        username,
        email,
        password,
    }))
);
console.log(`Meetings: ${demoMeetings.length}`);
console.table(
    demoMeetings.map(({ name, roomName, scheduledAt, duration }) => ({
        name,
        roomName,
        scheduledAt,
        duration,
    }))
);
