import mongoose from "mongoose";
import dotenv from "dotenv";
import { Event } from "../src/modules/event/model/event.model";
import { EventGuest } from "../src/modules/event/model/event-guest.model";

dotenv.config();

async function sync() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    
    const events = await Event.find();
    for (const event of events) {
      const updatedGuestIds = [];
      for (const guestId of event.guests) {
        const guest = await EventGuest.findById(guestId);
        if (!guest) continue;
        
        // Find the matching updated guest by name
        const updatedGuest = await EventGuest.findOne({ fullName: guest.fullName });
        if (updatedGuest) {
          updatedGuestIds.push(updatedGuest._id);
        } else {
          updatedGuestIds.push(guestId);
        }
      }
      
      event.guests = updatedGuestIds;
      await event.save();
      console.log(`Synced guests for event: ${event.title}`);
    }

    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
  }
}
sync();
