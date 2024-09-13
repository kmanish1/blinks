import { PrismaClient } from "@prisma/client";
import {
  ActionError,
  ActionPostRequest,
  ActionPostResponse,
  createActionHeaders,
  createPostResponse,
} from "@solana/actions";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import * as cheerio from "cheerio";
import { mockTx } from "../fn";

const headers = createActionHeaders();

export const GET = async (req: Request) => {
  return Response.json({ message: "Method not supported" } as ActionError, {
    status: 403,
    headers,
  });
};

export const OPTIONS = async () => Response.json(null, { headers });

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body: ActionPostRequest = await req.json();
  //@ts-ignore
  const arr = body.data.meetid.split(",");
  const ogImageUrl = await getImage();

  let account: PublicKey;
  try {
    account = new PublicKey(body.account);
  } catch (err) {
    throw new Error("Invalid account");
  }
  //@ts-ignore
  let price = body.data!.price;
  const id = await prisma.solMeet.create({
    data: {
      meetingId: parseInt(arr[0]),
      title: arr[1],
      description: arr[2],
      address: account.toBase58(),
      price: parseInt(price),
      image: ogImageUrl!,
    },
  });

  const tx = await mockTx(account);

  const payload: ActionPostResponse = await createPostResponse({
    fields: {
      transaction: tx,
      message: `this is the last action`,
      links: {
        next: {
          type: "inline",
          action: {
            type: "completed",
            title: "completed the txn",
            description: `Here is your url https://api/actions/solmeet/meet/?${id.id}`,
            icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/330px-QR_code_for_mobile_English_Wikipedia.svg.png",
            label: "completed",
          },
        },
      },
    },
  });

  return Response.json(payload, { headers });
}

async function getImage() {
  const res = await axios.get("https://cal.com/thrishank");
  const html = res.data;

  const $ = cheerio.load(html);
  const ogImage = $('meta[property="og:image"]').attr("content");

  return ogImage;
}
