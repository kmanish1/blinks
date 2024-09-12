import {
  Action,
  ActionError,
  createActionHeaders,
  NextAction,
} from "@solana/actions";

const headers = createActionHeaders();

export const GET = async (req: Request) => {
  return Response.json({ message: "Method not supported" } as ActionError, {
    status: 403,
    headers,
  });
};

export const OPTIONS = async () => Response.json(null, { headers });

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const data = JSON.parse(url.searchParams.get("data")!);
    console.log(data);
    //@ts-ignore
    const arr = data!.map((d) => ({
      label: d.title,
      value: `${d.id},${d.title},${d.description}`,
    }));

    const payload: NextAction = {
      type: "action",
      title: "Generate Blink",
      label: "abcd edf",
      description: "this is the only description",
      icon: "https://cal.com/_next/image?url=https%3A%2F%2Fwww.datocms-assets.com%2F77432%2F1685376092-no-show-fee.png&w=1200&q=75",
      links: {
        actions: [
          {
            label: "Create your blink",
            href: "/api/actions/solmeet/create/last-action",
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
    };
    return Response.json(payload, { headers });
  } catch (e) {
    let ActionError: ActionError = { message: "abcd" };
    return Response.json(ActionError, {
      status: 400,
      headers,
    });
  }
}
