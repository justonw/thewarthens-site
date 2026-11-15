// The job tracker's saved format, shared by the tracker on /tech and the "add to my tracker" button on
// the resume tool, so both read and write the same list in the visitor's browser.
export const TRACKER_KEY = "warthens-job-tracker-v1";

export const TRACKER_STATUSES = [
  "Not Yet Applied",
  "Applied",
  "Phone Screen",
  "Interview",
  "Final Round",
  "Offer Received",
  "Rejected",
  "Withdrawn",
] as const;

export type TrackerStatus = (typeof TRACKER_STATUSES)[number];

export type TrackerEntry = {
  id: string;
  company: string;
  role: string;
  status: TrackerStatus;
  dateApplied: string;
  notes: string;
};

export const NO_TRACKER_ENTRIES: TrackerEntry[] = [];
