"use client";

import { useState } from "react";

// One-tap copy for the contact email, for people on a computer with no mail app set up.
export default function CopyEmailButton({
  email,
  className = "",
}: {
  email: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard blocked: the email is still shown on screen to copy by hand.
    }
  }

  return (
    <button type="button" onClick={copy} className={className} aria-live="polite">
      {copied ? "Copied!" : "Copy email"}
    </button>
  );
}
