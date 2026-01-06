const express = require("express");
const User = require("../models/User");
const UserWhiskey = require("../models/UserWhiskey");
const router = express.Router();
const validateSession = require("../middleware/Validate-Session");

// Search users by username
router.get("/search-users", validateSession, async (req, res) => {
  try {
    const { username } = req.query;
    const currentUserId = req.user.id;

    if (!username || username.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "Please enter at least 2 characters to search" });
    }

    // Find users matching the search query (case-insensitive), excluding the current user
    const users = await User.find({
      username: { $regex: username, $options: "i" },
      _id: { $ne: currentUserId },
    }).select("username _id");

    // Get current user to check friend status
    const currentUser = await User.findById(currentUserId);

    // Add friendship status to each user
    const usersWithStatus = users.map((user) => {
      const isFriend = currentUser.friends.includes(user._id);
      const hasPendingRequest = currentUser.sentRequests.includes(user._id);
      const hasReceivedRequest = currentUser.friendRequests.some(
        (req) => req.from.toString() === user._id.toString()
      );

      return {
        _id: user._id,
        username: user.username,
        status: isFriend
          ? "friends"
          : hasPendingRequest
          ? "pending"
          : hasReceivedRequest
          ? "received"
          : "none",
      };
    });

    res.json({ users: usersWithStatus });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: error.message });
  }
});

// Send friend request
router.post("/send-friend-request", validateSession, async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user.id;

    if (userId === currentUserId) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already friends
    if (currentUser.friends.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }

    // Check if request already sent
    if (currentUser.sentRequests.includes(userId)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Check if there's a pending request from the target user
    const hasReceivedRequest = currentUser.friendRequests.some(
      (req) => req.from.toString() === userId
    );
    if (hasReceivedRequest) {
      return res.status(400).json({
        message:
          "This user has already sent you a friend request. Check your pending requests!",
      });
    }

    // Add to current user's sent requests
    currentUser.sentRequests.push(userId);
    await currentUser.save();

    // Add to target user's friend requests
    targetUser.friendRequests.push({ from: currentUserId });
    await targetUser.save();

    res.json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get pending friend requests
router.get("/friend-requests", validateSession, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId).populate(
      "friendRequests.from",
      "username _id"
    );

    const requests = currentUser.friendRequests.map((req) => ({
      _id: req.from._id,
      username: req.from.username,
      createdAt: req.createdAt,
    }));

    res.json({ requests });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ message: error.message });
  }
});

// Accept friend request
router.post("/accept-friend-request", validateSession, async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId);
    const requestingUser = await User.findById(userId);

    if (!requestingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if request exists
    const requestIndex = currentUser.friendRequests.findIndex(
      (req) => req.from.toString() === userId
    );

    if (requestIndex === -1) {
      return res
        .status(400)
        .json({ message: "No friend request from this user" });
    }

    // Remove from friend requests
    currentUser.friendRequests.splice(requestIndex, 1);

    // Add each other as friends
    currentUser.friends.push(userId);
    requestingUser.friends.push(currentUserId);

    // Remove from requesting user's sent requests
    requestingUser.sentRequests = requestingUser.sentRequests.filter(
      (id) => id.toString() !== currentUserId
    );

    await currentUser.save();
    await requestingUser.save();

    res.json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: error.message });
  }
});

// Deny friend request
router.post("/deny-friend-request", validateSession, async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId);
    const requestingUser = await User.findById(userId);

    // Check if request exists
    const requestIndex = currentUser.friendRequests.findIndex(
      (req) => req.from.toString() === userId
    );

    if (requestIndex === -1) {
      return res
        .status(400)
        .json({ message: "No friend request from this user" });
    }

    // Remove from friend requests
    currentUser.friendRequests.splice(requestIndex, 1);
    await currentUser.save();

    // Remove from requesting user's sent requests (if they exist)
    if (requestingUser) {
      requestingUser.sentRequests = requestingUser.sentRequests.filter(
        (id) => id.toString() !== currentUserId
      );
      await requestingUser.save();
    }

    res.json({ message: "Friend request denied" });
  } catch (error) {
    console.error("Error denying friend request:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get friends list
router.get("/friends-list", validateSession, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId).populate(
      "friends",
      "username _id profilePicture"
    );

    const friends = currentUser.friends.map((friend) => ({
      _id: friend._id,
      username: friend.username,
      profilePicture: friend.profilePicture,
    }));

    res.json({ friends });
  } catch (error) {
    console.error("Error fetching friends list:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get a friend's whiskey list
router.get("/friend-whiskeys/:friendId", validateSession, async (req, res) => {
  try {
    const { friendId } = req.params;
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId);

    // Check if they are friends
    if (!currentUser.friends.includes(friendId)) {
      return res
        .status(403)
        .json({ message: "You can only view whiskeys of your friends" });
    }

    const friend = await User.findById(friendId).select("username");
    const userWhiskey = await UserWhiskey.findOne({ userId: friendId });

    // Get whiskeys array and sort by score (descending)
    const whiskeys = userWhiskey
      ? userWhiskey.whiskeys.sort((a, b) => b.score - a.score)
      : [];

    res.json({
      friend: { _id: friend._id, username: friend.username },
      whiskeys,
    });
  } catch (error) {
    console.error("Error fetching friend's whiskeys:", error);
    res.status(500).json({ message: error.message });
  }
});

// Remove friend
router.post("/remove-friend", validateSession, async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId);
    const friendUser = await User.findById(userId);

    if (!friendUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove from both users' friends lists
    currentUser.friends = currentUser.friends.filter(
      (id) => id.toString() !== userId
    );
    friendUser.friends = friendUser.friends.filter(
      (id) => id.toString() !== currentUserId
    );

    await currentUser.save();
    await friendUser.save();

    res.json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
