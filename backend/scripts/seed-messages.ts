import mongoose from "mongoose";
import dotenv from "dotenv";
import { Messages } from "../src/models/Messages.js";
import User from "../src/models/User.js";
import connectDB from "../src/lib/db.js";

// Load environment variables
dotenv.config();

const seedMessages = async () => {
  console.log("Connecting to Database...");
  await connectDB();

  // Find two users to generate chat data between
  const users = await User.find().limit(2);

  if (users.length < 2) {
    console.error(
      "❌ Not enough users found. Please create at least 2 users via the app first.",
    );
    process.exit(1);
  }

  const user1 = users[0]._id;
  const user2 = users[1]._id;

  console.log(
    `Seeding messages between ${users[0].fullName} and ${users[1].fullName}...`,
  );

  const messagesToInsert = [];
  const numberOfMessages = 100; // You can increase this if you want more pages

  // Base date for messages (start 50 minutes ago)
  let baseDate = new Date();
  baseDate.setMinutes(baseDate.getMinutes() - numberOfMessages);

  for (let i = 0; i < numberOfMessages; i++) {
    // Alternate sender and receiver
    const isUser1Sender = i % 2 === 0;

    // Increment time by 1 minute for each message to maintain chronological order
    const createdAt = new Date(baseDate.getTime() + i * 60000);

    messagesToInsert.push({
      senderId: isUser1Sender ? user1 : user2,
      receiverId: isUser1Sender ? user2 : user1,
      text: `This is test message #${i + 1} for pagination testing.`,
      createdAt,
      updatedAt: createdAt,
    });
  }

  try {
    // Clean up existing messages between these two users (optional, makes it easier to test freshly)
    await Messages.deleteMany({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    });
    console.log("Cleared old messages between the two users.");

    // Insert new seeded messages
    await Messages.insertMany(messagesToInsert);
    console.log(`✅ Successfully seeded ${numberOfMessages} messages!`);
  } catch (error) {
    console.error("❌ Error seeding messages:", error);
  } finally {
    console.log("Disconnecting from Database...");
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedMessages();
