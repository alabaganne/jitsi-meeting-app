const demoUsers = [
    {
        id: 1,
        name: "Demo User",
        username: "demo",
        email: "demo@jitsimeet.local",
        password: "Demo@123",
        createdAt: "2026-01-01T09:00:00.000Z",
    },
];

const demoMeetings = [
    {
        id: "demo-weekly-sync",
        name: "Weekly Product Sync",
        roomName: "jitsi-demo-weekly-sync",
        description: "A seeded demo meeting for exploring the meeting dashboard.",
        organizerId: 1,
        organizerName: "demo",
        scheduledAt: "2026-05-20T14:00:00.000Z",
        duration: 45,
        isActive: true,
        invitees: [
            { email: "sarah@example.com", name: "Sarah", status: "accepted" },
            { email: "omar@example.com", name: "Omar", status: "pending" },
        ],
        createdAt: "2026-01-01T09:30:00.000Z",
    },
    {
        id: "demo-design-review",
        name: "Design Review",
        roomName: "jitsi-demo-design-review",
        description: "Review the new video meeting experience and capture feedback.",
        organizerId: 1,
        organizerName: "demo",
        scheduledAt: "2026-05-22T10:30:00.000Z",
        duration: 30,
        isActive: true,
        invitees: [
            { email: "designer@example.com", name: "Design Lead", status: "pending" },
        ],
        createdAt: "2026-01-02T11:00:00.000Z",
    },
];

module.exports = {
    demoUsers,
    demoMeetings,
};
