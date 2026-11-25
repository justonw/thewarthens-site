// The emails for Atiya's birthday lunch. Everything a guest typed is HTML-escaped before it goes into an email.
import { EVENT, PARKING, type RsvpStatus } from "@/lib/birthday";
import { escapeHtml } from "@/lib/mail";

const PAGE = "https://thewarthens.com/birthday";
const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(PARKING.mapsQuery)}`;
const CAL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(EVENT.title)}&dates=20261206T172800Z/20261206T200000Z&location=${encodeURIComponent(
  `${EVENT.venue}, ${EVENT.addressLine}, ${EVENT.cityLine}`,
)}&details=${encodeURIComponent(`Details: ${PAGE}`)}`;

function shell(heading: string, body: string): string {
  return `<div style="background:#fbf5ff;padding:24px 12px;font-family:Georgia,'Times New Roman',serif;color:#2a1a3d">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e6d3f5">
    <div style="background:#6d28d9;color:#ffffff;padding:26px 28px">
      <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#fde68a">You are invited</div>
      <div style="font-size:28px;line-height:1.2;margin-top:6px">${escapeHtml(heading)}</div>
    </div>
    <div style="padding:26px 28px;font-size:16px;line-height:1.6">${body}</div>
    <div style="padding:16px 28px;background:#fbf5ff;font-size:12px;color:#6b5a80">Sent by The Warthens. Everything about the day lives at <a href="${PAGE}" style="color:#be123c">thewarthens.com/birthday</a>.</div>
  </div></div>`;
}

const detailsBlock = `<table style="width:100%;border-collapse:collapse;margin:14px 0;font-size:15px">
  <tr><td style="padding:6px 0;color:#6b5a80;width:92px">When</td><td style="padding:6px 0"><b>${EVENT.dateLabel}</b>, arrive between <b>${EVENT.arriveLabel}</b></td></tr>
  <tr><td style="padding:6px 0;color:#6b5a80">Where</td><td style="padding:6px 0"><b>${EVENT.venue}</b><br>${EVENT.addressLine}<br>${EVENT.cityLine}</td></tr>
  <tr><td style="padding:6px 0;color:#6b5a80">Seating</td><td style="padding:6px 0">No table is reserved. We will all show up and pick a place to sit.</td></tr>
  <tr><td style="padding:6px 0;color:#6b5a80">Parking</td><td style="padding:6px 0">First two hours free in the Orange Deck, the Westbound Deck, or Up Front. <a href="${PAGE}#parking" style="color:#be123c">Parking details</a></td></tr>
</table>
<p style="margin:14px 0"><a href="${MAPS}" style="color:#be123c">Open the map</a> &nbsp;|&nbsp; <a href="${CAL}" style="color:#be123c">Add to Google Calendar</a> &nbsp;|&nbsp; <a href="${PAGE}" style="color:#be123c">Menu picks and photos</a></p>`;

const button = (label: string, href: string) =>
  `<p style="margin:22px 0"><a href="${href}" style="background:#e11d48;color:#fff;text-decoration:none;padding:13px 22px;border-radius:999px;font-family:Arial,sans-serif;font-weight:bold;display:inline-block">${escapeHtml(label)}</a></p>`;

export type Mail = { subject: string; html: string };

const list = (names: string[]) => names.map(escapeHtml).join(", ");

export function confirmation(status: RsvpStatus, names: string[], updated: boolean): Mail {
  const who = escapeHtml(names[0] ?? "friend");
  if (status === "yes") {
    return {
      subject: `You're on the list! Atiya's Birthday Lunch, ${EVENT.dateShort}`,
      html: shell(
        `${names[0] ?? "Friend"}, you are on the list`,
        `<p>${updated ? "We updated your answer." : "Thank you for saying yes."} People attending: <b>${names.length}</b> (${list(names)}).</p>${detailsBlock}<p>You will get a reminder five days before and another the evening before.</p>${button("See the menu picks and parking", PAGE)}<p style="font-size:14px;color:#6b5a80">Need to change something? Open the page and answer again with this same email address.</p>`,
      ),
    };
  }
  if (status === "maybe") {
    return {
      subject: `Atiya's Birthday Lunch: we saved a maybe for you`,
      html: shell(
        `${who}, we are saving your spot`,
        `<p>Thanks for letting us know. We marked you as a <b>maybe</b> for ${EVENT.dateLabel}. Please make your final answer by <b>${EVENT.cutoffLabel}</b> so we can plan.</p>${detailsBlock}${button("Make it a yes", PAGE)}`,
      ),
    };
  }
  return {
    subject: `Atiya's Birthday Lunch: we will miss you`,
    html: shell(
      `${who}, we will miss you`,
      `<p>Thanks for answering. We will miss you on ${EVENT.dateLabel}. If your plans change before <b>${EVENT.cutoffLabel}</b>, you can still change your answer.</p>${button("Change my answer", PAGE)}`,
    ),
  };
}

export const REMINDERS = {
  nudge(names: string[]): Mail {
    return {
      subject: `Last call: Atiya's Birthday Lunch RSVP closes tomorrow`,
      html: shell(
        "One more chance to join us",
        `<p>Hi ${escapeHtml(names[0] ?? "friend")}. The RSVP for Atiya's birthday lunch closes tomorrow, <b>${EVENT.cutoffLabel}</b>. If your plans changed and you can make it, we would love to have you.</p>${detailsBlock}${button("Change my answer", PAGE)}`,
      ),
    };
  },
  fiveDays(names: string[]): Mail {
    return {
      subject: `5 days until Atiya's Birthday Lunch`,
      html: shell(
        "Five days to go",
        `<p>Hi ${escapeHtml(names[0] ?? "friend")}. This is your reminder that you are on the list for Atiya's birthday lunch on <b>${EVENT.dateLabel}</b>. People in your party: <b>${names.length}</b>.</p>${detailsBlock}${button("Plan your order and parking", PAGE)}`,
      ),
    };
  },
  eveningBefore(names: string[]): Mail {
    return {
      subject: `Tomorrow: Atiya's Birthday Lunch at ${EVENT.venue}`,
      html: shell(
        "See you tomorrow",
        `<p>Hi ${escapeHtml(names[0] ?? "friend")}. Tomorrow is Atiya's birthday lunch. Arrive between <b>${EVENT.arriveLabel}</b>, and plan on about two hours so your parking stays free.</p>${detailsBlock}${button("Open the details", PAGE)}`,
      ),
    };
  },
};

export function notifyJuston(kind: "new" | "updated", status: RsvpStatus, names: string[], email: string, totals: { yes: number; maybe: number; no: number }): Mail {
  const label = status === "yes" ? "YES" : status === "maybe" ? "MAYBE" : "NO";
  return {
    subject: `Birthday RSVP ${label}: ${names.join(", ").slice(0, 80)}`,
    html: `<p><b>${kind === "new" ? "New RSVP" : "Updated RSVP"}: ${label}</b></p>
<p>Names: ${list(names)}<br>Email: ${escapeHtml(email)}</p>
<p>Totals so far: <b>${totals.yes}</b> people yes, <b>${totals.maybe}</b> people maybe, <b>${totals.no}</b> no .</p>`,
  };
}
