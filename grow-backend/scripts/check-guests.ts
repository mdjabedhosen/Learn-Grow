import mongoose from "mongoose";
import dotenv from "dotenv";
import { EventGuest } from "../src/modules/event/model/event-guest.model";

dotenv.config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const guests = await EventGuest.find();
    console.log('All EventGuests:');
    guests.forEach(g => console.log(`- ${g.fullName}: ${g.profileImage}`));
    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
  }
}
check();
