export type CreateDeckCardInput = {
  requestId: string;
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

type DeckLabel = {
  id: number;
  title: string;
};

type DeckBoard = {
  labels?: DeckLabel[];
};

type DeckCard = {
  id: number;
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

function getHeaders(config: DeckConfig): Record<string, string> {
  const credentials = Buffer.from(
    `${config.user}:${config.appPassword}`,
  ).toString("base64");

  return {
    Authorization: `Basic ${credentials}`,
    "OCS-APIRequest": "true",
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

async function getOrCreateLabel(
  config: DeckConfig,
  topic: string,
): Promise<number> {
  const boardEndpoint =
    `${config.url}/index.php/apps/deck/api/v1.0/boards/` + config.boardId;

  const boardResponse = await fetch(boardEndpoint, {
    headers: getHeaders(config),
  });

  if (!boardResponse.ok) {
    const responseBody = await boardResponse.text();

    console.error(
      "Nextcloud Deck board API error:",
      boardResponse.status,
      responseBody,
    );

    throw new Error(
      `Unable to read Nextcloud Deck board (${boardResponse.status}).`,
    );
  }

  const board = (await boardResponse.json()) as DeckBoard;

  const existingLabel = board.labels?.find((label) => label.title === topic);

  if (existingLabel) {
    return existingLabel.id;
  }

  const labelEndpoint =
    `${config.url}/index.php/apps/deck/api/v1.0/boards/` +
    `${config.boardId}/labels`;

  const labelResponse = await fetch(labelEndpoint, {
    method: "POST",
    headers: getHeaders(config),

    body: JSON.stringify({
      title: topic,
      color: "0082C9",
    }),
  });

  if (!labelResponse.ok) {
    const responseBody = await labelResponse.text();

    console.error(
      "Nextcloud Deck label creation error:",
      labelResponse.status,
      responseBody,
    );

    throw new Error(
      `Unable to create Nextcloud Deck label (${labelResponse.status}).`,
    );
  }

  const label = (await labelResponse.json()) as DeckLabel;

  return label.id;
}

async function assignLabelToCard(
  config: DeckConfig,
  cardId: number,
  labelId: number,
): Promise<void> {
  const endpoint =
    `${config.url}/index.php/apps/deck/api/v1.0/boards/` +
    `${config.boardId}/stacks/${config.stackId}/cards/` +
    `${cardId}/assignLabel`;

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: getHeaders(config),

    body: JSON.stringify({
      labelId,
    }),
  });

  if (!response.ok) {
    const responseBody = await response.text();

    console.error(
      "Nextcloud Deck label assignment error:",
      response.status,
      responseBody,
    );

    throw new Error(
      `Unable to assign Nextcloud Deck label (${response.status}).`,
    );
  }
}

export async function createDeckCard(
  input: CreateDeckCardInput,
): Promise<void> {
  const config = getDeckConfig();

  // Find the Topic label or create it if it does not exist.
  const labelId = await getOrCreateLabel(config, input.topic);

  const endpoint =
    `${config.url}/index.php/apps/deck/api/v1.0/boards/` +
    `${config.boardId}/stacks/${config.stackId}/cards`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: getHeaders(config),

    body: JSON.stringify({
      title: `Anfrage: ${input.topic}, ${input.name}`,
      type: "plain",
      order: 999,

      description: [
        `Request-ID: ${input.requestId}`,
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

  const card = (await response.json()) as DeckCard;

  // Assign the Topic label to the newly created Card.
  await assignLabelToCard(config, card.id, labelId);
}
