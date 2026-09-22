import type { APIRoute } from "astro";

import { reconcilePendingMailLinks } from "../../services/mailReconciliationService";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const reconcileSecret = process.env.MAIL_RECONCILE_SECRET;

    if (!reconcileSecret) {
      console.error(
        "MAIL_RECONCILE_SECRET environment variable is not configured.",
      );

      return Response.json(
        {
          success: false,
          message: "Reconciliation service is not configured.",
        },
        { status: 500 },
      );
    }

    const authorization = request.headers.get("authorization");

    if (authorization !== `Bearer ${reconcileSecret}`) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const result = await reconcilePendingMailLinks();

    console.log("Mail reconciliation completed:", result);

    return Response.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Automatic mail reconciliation error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to reconcile mail.",
      },
      { status: 500 },
    );
  }
};
