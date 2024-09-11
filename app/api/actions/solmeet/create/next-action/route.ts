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
  const url = new URL(req.url);
  const data = url.searchParams.get("data");
  console.log(data);

  const payload: NextAction = {
    type: "action",
    title: "Book a session",
    label: "",
    description: "",
    icon: "",
    links: {
      actions: [
        {
          label: "Book the session",
          href: "",
          parameters: [
            {
              type: "select",
              options: [
                {
                  label: "Option 1",
                  value: "option1",
                },

              ],
              label: "Select an option",
              name: "username",
              required: true,
            },
          ],
        },
      ],
    },
  };
  return Response.json({ message: "Success" }, { headers });
}
