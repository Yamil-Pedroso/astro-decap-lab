export type CreateDeckCardInput = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

type DeckConfig = {
  url: string;
  user: string;
  appPassword: string;
  boardId: string;
  stackId: string;
};

function getEnv(name: string): string | undefined {
  return process.env[name] || import.meta.env[name];
}

function getDeckConfig(): DeckConfig {
  const url = getEnv("NEXTCLOUD_URL");
  const user = getEnv("NEXTCLOUD_USER");
  const appPassword = getEnv("NEXTCLOUD_APP_PASSWORD");
  const boardId = getEnv("NEXTCLOUD_DECK_BOARD_ID");
  const stackId = getEnv("NEXTCLOUD_DECK_STACK_ID");

  if (!url || !user || !appPassword || !boardId || !stackId) {
    throw new Error("Nextcloud Deck environment variables are not configured.");
  }

  return {
    url: url.replace(/\/$/, ""),
    user,
    appPassword,
    boardId,
    stackId,
  };
}

export async function createDeckCard(
  input: CreateDeckCardInput,
): Promise<void> {
  const config = getDeckConfig();

  const endpoint =
    `${config.url}/index.php/apps/deck/api/v1.0/boards/` +
    `${config.boardId}/stacks/${config.stackId}/cards`;

  const credentials = Buffer.from(
    `${config.user}:${config.appPassword}`,
  ).toString("base64");

  const response = await fetch(endpoint, {
    method: "POST",

    headers: {
      Authorization: `Basic ${credentials}`,
      "OCS-APIRequest": "true",
      "Content-Type": "application/json",
      Accept: "application/json",
    },

    body: JSON.stringify({
      title: `Anfrage: ${input.topic}, ${input.name}`,
      type: "plain",
      order: 999,

      description: [
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        `Topic: ${input.topic}`,
        "",
        "Message:",
        input.message,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const responseBody = await response.text();

    console.error("Nextcloud Deck API error:", response.status, responseBody);

    throw new Error(
      `Unable to create Nextcloud Deck card (${response.status}).`,
    );
  }
}
