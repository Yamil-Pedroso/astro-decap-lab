import { getDeckCards, updateDeckCardMailLink } from "./deckService";
import { findMailByRequestId } from "./nextcloudMailService";

export type ReconciliationResult = {
  checked: number;
  updated: number;
  pending: number;
  skipped: number;
};

function extractRequestId(
  description: string | null | undefined,
): string | null {
  if (!description) {
    return null;
  }

  const match = description.match(/Request-ID:\s*(REQ-[a-f0-9-]+)/i);

  return match?.[1] ?? null;
}

export async function reconcilePendingMailLinks(): Promise<ReconciliationResult> {
  const cards = await getDeckCards();

  let checked = 0;
  let updated = 0;
  let pending = 0;
  let skipped = 0;

  for (const card of cards) {
    const description = card.description ?? "";

    // Skip cards that already contain a Nextcloud Mail link.
    if (description.includes("/apps/mail/box/")) {
      skipped++;
      continue;
    }

    const requestId = extractRequestId(description);

    // Ignore cards that are not part of the contact-request workflow.
    if (!requestId) {
      skipped++;
      continue;
    }

    checked++;

    try {
      const mail = await findMailByRequestId(requestId);

      if (!mail) {
        pending++;

        console.log(`[${requestId}] Mail is still pending in Nextcloud Mail`);

        continue;
      }

      await updateDeckCardMailLink(card.id, mail.mailUrl);

      updated++;

      console.log(
        `[${requestId}] Deck card ${card.id} automatically reconciled`,
      );
    } catch (error) {
      pending++;

      console.error(`[${requestId}] Automatic reconciliation failed:`, error);
    }
  }

  return {
    checked,
    updated,
    pending,
    skipped,
  };
}
