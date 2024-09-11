import {
  Action,
  ActionGetResponse,
  ActionPostRequest,
  createActionHeaders,
} from "@solana/actions";
import { PublicKey } from "@solana/web3.js";
import axios from 'axios';
// import cheerio from 'cheerio';
import * as cheerio from 'cheerio';
const headers = createActionHeaders();

export function GET() {
  const payload: ActionGetResponse = {
    title: "Connect blinks and cal.com",
    description: "sd ckwdsfcoiwdskl fwkjdfn vwrkdsc",
    label: "Connect",
    icon: "https://cal.com/_next/image?url=https%3A%2F%2Fwww.datocms-assets.com%2F77432%2F1685376092-no-show-fee.png&w=1200&q=75",
    type: "action",
    links: {
      actions: [
        {
          label: "Next",
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
}

export async function OPTIONS() {
  return new Response(null, { headers });
}

export async function POST(req: Request) {
  const body: ActionPostRequest = await req.json();
  //@ts-ignore
  //if username is not valid, please send a action error
  await getEventTypes(body.data.username);
  let account: PublicKey;
  try {
    account = new PublicKey(body.account);
  } catch (err) {
    return new Response('Invalid "account" provided', {
      status: 400,
      headers,
    });
  }

  console.log(account, body);
  return Response.json({ success: true }, { headers });
}

async function getEventTypes(username: any) {
  try {
    const { data } = await axios.get(`https://cal.com/${username}`);
    const $ = cheerio.load(data);
    const nextDataScript = $("#__NEXT_DATA__").html();
    const jsonData = JSON.parse(nextDataScript!);
    const eventTypes = jsonData.props.pageProps.eventTypes;
    console.log("full");
    console.log(JSON.stringify(eventTypes, null, 2));
  } catch (error) {
    console.log(error);
  }
}
