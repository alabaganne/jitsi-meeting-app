const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const { authenticateToken } = require("./auth");

// In-memory meetings store (replace with database in production)
const meetings = [];

// Get all meetings for the authenticated user
router.get("/", authenticateToken, (req, res) => {
    try {
        const userMeetings = meetings.filter(
            (m) => m.organizerId === req.user.id
        );

        res.json({
            success: true,
            data: userMeetings,
        });
    } catch (error) {
        console.error("Get meetings error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve meetings",
        });
    }
});

// Get a specific meeting
router.get("/:id", authenticateToken, (req, res) => {
    try {
        const meeting = meetings.find(
            (m) => m.id === req.params.id && m.organizerId === req.user.id
        );

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found",
            });
        }

        res.json({
            success: true,
            data: meeting,
        });
    } catch (error) {
        console.error("Get meeting error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve meeting",
        });
    }
});

// Create a new meeting
router.post("/", authenticateToken, (req, res) => {
    try {
        const { name, description, scheduledAt, duration, inviteeEmails } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Meeting name is required",
            });
        }

        const roomName = `jitsi-${uuidv4().slice(0, 8)}`;

        const newMeeting = {
            id: uuidv4(),
            name,
            roomName,
            description: description || "",
            organizerId: req.user.id,
            organizerName: req.user.username,
            scheduledAt: scheduledAt || new Date().toISOString(),
            duration: duration || 60,
            isActive: true,
            invitees: inviteeEmails
                ? inviteeEmails.map((email) => ({
                      email,
                      status: "pending",
                  }))
                : [],
            createdAt: new Date().toISOString(),
        };

        meetings.push(newMeeting);

        res.status(201).json({
            success: true,
            message: "Meeting created successfully",
            data: newMeeting,
        });
    } catch (error) {
        console.error("Create meeting error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create meeting",
        });
    }
});

// Update a meeting
router.put("/:id", authenticateToken, (req, res) => {
    try {
        const meetingIndex = meetings.findIndex(
            (m) => m.id === req.params.id && m.organizerId === req.user.id
        );

        if (meetingIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found",
            });
        }

        const { name, description, scheduledAt, duration, inviteeEmails, isActive } = req.body;

        if (name) meetings[meetingIndex].name = name;
        if (description !== undefined) meetings[meetingIndex].description = description;
        if (scheduledAt) meetings[meetingIndex].scheduledAt = scheduledAt;
        if (duration) meetings[meetingIndex].duration = duration;
        if (isActive !== undefined) meetings[meetingIndex].isActive = isActive;
        if (inviteeEmails) {
            meetings[meetingIndex].invitees = inviteeEmails.map((email) => ({
                email,
                status: "pending",
            }));
        }

        res.json({
            success: true,
            message: "Meeting updated successfully",
            data: meetings[meetingIndex],
        });
    } catch (error) {
        console.error("Update meeting error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update meeting",
        });
    }
});

// Delete a meeting
router.delete("/:id", authenticateToken, (req, res) => {
    try {
        const meetingIndex = meetings.findIndex(
            (m) => m.id === req.params.id && m.organizerId === req.user.id
        );

        if (meetingIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found",
            });
        }

        meetings.splice(meetingIndex, 1);

        res.json({
            success: true,
            message: "Meeting deleted successfully",
        });
    } catch (error) {
        console.error("Delete meeting error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete meeting",
        });
    }
});

// Join a meeting by room name (public endpoint)
router.get("/join/:roomName", (req, res) => {
    try {
        const meeting = meetings.find((m) => m.roomName === req.params.roomName);

        if (!meeting) {
            // Return a generic meeting object for ad-hoc meetings
            return res.json({
                success: true,
                data: {
                    id: uuidv4(),
                    name: "Ad-hoc Meeting",
                    roomName: req.params.roomName,
                    isActive: true,
                    createdAt: new Date().toISOString(),
                },
            });
        }

        res.json({
            success: true,
            data: meeting,
        });
    } catch (error) {
        console.error("Join meeting error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to join meeting",
        });
    }
});

module.exports = router;
