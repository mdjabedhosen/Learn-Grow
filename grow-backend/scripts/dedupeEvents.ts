/**
 * Removes the duplicate event / event-guest rows that the concurrent-boot
 * race in the seeder created.
 *
 * Guests are deduplicated first and every event reference is repointed at the
 * surviving row, then the duplicate events are removed.
 *
 * Run once:  node --import tsx scripts/dedupeEvents.ts
 */
import mongoose from "mongoose";
import { ENV } from "../src/config/env.js";
import { EventGuest } from "../src/modules/event/model/event-guest.model.js";
import { Event } from "../src/modules/event/model/event.model.js";

const keepOldest = <T extends { _id: any; createdAt?: Date }>(rows: T[]): T =>
  [...rows].sort((a, b) => {
    const at = a.createdAt?.getTime() ?? 0;
    const bt = b.createdAt?.getTime() ?? 0;
    if (at !== bt) return at - bt;
    return String(a._id).localeCompare(String(b._id));
  })[0];

(async () => {
  await mongoose.connect(ENV.MONGODB_URI);

  // ---------- 1. guests ----------
  const guests = await EventGuest.find({}).lean();
  const byEmail = new Map<string, any[]>();
  const noEmail: any[] = [];

  for (const g of guests as any[]) {
    if (g.email) {
      const key = String(g.email).toLowerCase();
      (byEmail.get(key) || byEmail.set(key, []).get(key)!).push(g);
    } else {
      noEmail.push(g);
    }
  }

  const guestIdMap = new Map<string, string>(); // duplicate _id -> keeper _id
  let removedGuests = 0;

  for (const [email, rows] of byEmail) {
    if (rows.length <= 1) continue;
    const keeper = keepOldest(rows);
    for (const dup of rows) {
      if (String(dup._id) === String(keeper._id)) continue;
      guestIdMap.set(String(dup._id), String(keeper._id));
      removedGuests++;
    }
    console.log(
      `  guest "${email}" x${rows.length} -> keeping ${keeper._id}, removing ${
        rows.length - 1
      }`
    );
  }

  // Guests without an email cannot be matched on identity, so they are left
  // alone - they are distinct people (Sabbir, Shovan, Jabed).
  if (noEmail.length) {
    console.log(`  ${noEmail.length} guest(s) without an email left untouched`);
  }

  if (guestIdMap.size) {
    // Repoint every event reference at the surviving guest row.
    const events = await Event.find({}).lean();
    for (const ev of events as any[]) {
      const refs: string[] = (ev.guests || []).map((g: any) => String(g));
      if (!refs.length) continue;
      const mapped = refs.map((r) => guestIdMap.get(r) ?? r);
      const changed = mapped.some((m, i) => m !== refs[i]);
      const deduped = [...new Set(mapped)];
      if (changed || deduped.length !== refs.length) {
        await Event.updateOne({ _id: ev._id }, { $set: { guests: deduped } });
        console.log(`  event "${ev.title}" guest refs repointed`);
      }
    }

    for (const [dupId] of guestIdMap) {
      await EventGuest.deleteOne({ _id: new mongoose.Types.ObjectId(dupId) });
    }
  }

  // ---------- 2. events ----------
  const events = await Event.find({}).lean();
  const byTitle = new Map<string, any[]>();
  for (const e of events as any[]) {
    (byTitle.get(e.title) || byTitle.set(e.title, []).get(e.title)!).push(e);
  }

  let removedEvents = 0;
  for (const [title, rows] of byTitle) {
    if (rows.length <= 1) continue;
    const keeper = keepOldest(rows);
    for (const dup of rows) {
      if (String(dup._id) === String(keeper._id)) continue;
      await Event.deleteOne({ _id: dup._id });
      removedEvents++;
    }
    console.log(
      `  event "${title}" x${rows.length} -> keeping ${keeper._id}, removing ${
        rows.length - 1
      }`
    );
  }

  // ---------- 3. report ----------
  const finalGuests = await EventGuest.countDocuments();
  const finalEvents = await Event.countDocuments();
  console.log(
    `\n  removed ${removedGuests} duplicate guest(s) and ${removedEvents} duplicate event(s)`
  );
  console.log(`  guests now: ${finalGuests}, events now: ${finalEvents}`);

  await mongoose.disconnect();
})();
