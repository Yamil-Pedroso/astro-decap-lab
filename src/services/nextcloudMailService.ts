type NextcloudMailConfig = {
  url: string;
  user: string;
  appPassword: string;
  mailboxId: string;
};

type NextcloudMailMessage = {
  databaseId: number;
  uid: number;
  mailboxId: number;
  messageId: string | null;
  threadRootId: string | null;
  subject: string;
};

export type NextcloudMailResult = {
  databaseId: number;
  mailboxId: number;
  messageId: string | null;
  threadRootId: string | null;
  mailUrl: string;
};

function getEnv(name: string): string | undefined {
  return process.env[name];
}

function getMailConfig(): NextcloudMailConfig {
  const url = getEnv("NEXTCLOUD_URL");
  const user = getEnv("NEXTCLOUD_USER");
  const appPassword = getEnv("NEXTCLOUD_APP_PASSWORD");
  const mailboxId = getEnv("NEXTCLOUD_MAIL_MAILBOX_ID");

  if (!url || !user || !appPassword || !mailboxId) {
    throw new Error("Nextcloud Mail environment variables are not configured.");
  }

  return {
    url: url.replace(/\/$/, ""),
    user,
    appPassword,
    mailboxId,
  };
}

function getHeaders(config: NextcloudMailConfig): Record<string, string> {
  const credentials = Buffer.from(
    `${config.user}:${config.appPassword}`,
  ).toString("base64");

  return {
    Authorization: `Basic ${credentials}`,
    "OCS-APIRequest": "true",
    Accept: "application/json",
  };
}

export async function findMailByRequestId(
  requestId: string,
): Promise<NextcloudMailResult | null> {
  const config = getMailConfig();

  const params = new URLSearchParams({
    mailboxId: config.mailboxId,
    filter: `subject:${requestId}`,
    limit: "20",
  });

  const endpoint =
    `${config.url}/index.php/apps/mail/api/messages?` + params.toString();

  const response = await fetch(endpoint, {
    method: "GET",
    headers: getHeaders(config),
  });

  if (!response.ok) {
    const responseBody = await response.text();

    console.error("Nextcloud Mail API error:", response.status, responseBody);

    throw new Error(`Unable to search Nextcloud Mail (${response.status}).`);
  }

  const messages = (await response.json()) as NextcloudMailMessage[];

  const message = messages.find((item) => item.subject.includes(requestId));

  if (!message) {
    return null;
  }

  const mailUrl =
    `${config.url}/apps/mail/box/` +
    `${message.mailboxId}/thread/${message.databaseId}`;

  return {
    databaseId: message.databaseId,
    mailboxId: message.mailboxId,
    messageId: message.messageId,
    threadRootId: message.threadRootId,
    mailUrl,
  };
}
