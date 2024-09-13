import {
  ActionError,
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  createActionHeaders,
  createPostResponse,
  NextActionLink,
} from "@solana/actions";
import { PublicKey } from "@solana/web3.js";
import { getEventTypes, mockTx } from "./fn";

const headers = createActionHeaders();

export function GET() {
  try {
    const payload: ActionGetResponse = {
      title: "Connect blinks and cal.com",
      description: "sd ckwdsfcoiwdskl fwkjdfn vwrkdsc",
      label: "Connect",
      icon: "https://cal.com/_next/image?url=https%3A%2F%2Fwww.datocms-assets.com%2F77432%2F1685376092-no-show-fee.png&w=1200&q=75",
      type: "action",
      links: {
        actions: [
          {
            label: "Connect your wallet",
            href: "/api/actions/solmeet/create",
            parameters: [
              {
                type: "text",
                label: "Enter your cal.com username",
                name: "username",
                required: true,
              },
            ],
          },
        ],
      },
    };

    return Response.json(payload, { headers });
  } catch (err) {
    console.log(err);
    let actionError: ActionError = { message: "An unknown error occurred" };
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
}

export async function OPTIONS() {
  return new Response(null, { headers });
}

export async function POST(req: Request) {
  try {
    const body: ActionPostRequest = await req.json();

    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      throw "Invalid account provided";
    }

    const tx = await mockTx(account);

    // @ts-ignore
    const arr = await getEventTypes(body.data.username);

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction: tx,
        message: `edsuif cerdcguv nt fdv`,
        links: {
          next: NextAction(arr),
        },
      },
    });

    return Response.json(payload, { headers });
  } catch (err) {
    console.log(err);
    let actionError: ActionError = { message: "An unknown error occurred" };

    if (err instanceof Error) {
      actionError.message = err.message;
    } else if (typeof err === "string") {
      actionError.message = err;
    }

    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
}

function NextAction(arr: any): NextActionLink {
  return {
    type: "inline",
    action: {
      type: "action",
      title: "Generate Blink",
      description: "this is the only description",
      icon: "https://cal.com/_next/image?url=https%3A%2F%2Fwww.datocms-assets.com%2F77432%2F1685376092-no-show-fee.png&w=1200&q=75",
      label: "abcd edf",
      links: {
        actions: [
          {
            label: "Create your blink",
            href: "/api/actions/solmeet/create/action",
            parameters: [
              {
                type: "select",
                options: arr,
                label: "Select an option",
                name: "meetid",
                required: true,
              },
              {
                type: "number",
                label: "Enter price for one slot (USDC)",
                name: "price",
              },
            ],
          },
        ],
      },
    },
  };
}
