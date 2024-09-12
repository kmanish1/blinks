import { PrismaClient } from "@prisma/client";
import {
  Action,
  ActionError,
  ActionPostRequest,
  ActionPostResponse,
  createActionHeaders,
  createPostResponse,
  NextAction,
} from "@solana/actions";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

const headers = createActionHeaders();

export const GET = async (req: Request) => {
  return Response.json({ message: "Method not supported" } as ActionError, {
    status: 403,
    headers,
  });
};

export const OPTIONS = async () => Response.json(null, { headers });
const prisma=new PrismaClient();
export async function POST(req: Request) {
  const body: ActionPostRequest = await req.json();
  //@ts-ignore
  const arr = body.data.meetid.split(",");
  console.log(arr);
  let account: PublicKey;
  try {
      account = new PublicKey(body.account);
    } catch (err) {
        return new Response('Invalid "account" provided', {
            status: 400,
            headers,
        });
    }
    //@ts-ignore
    let price=body.data!.price;
    const id=await prisma.solMeet.create({
      data:{
          meetingId:parseInt(arr[0]),
          title:arr[1],
          description:arr[2],
          address:account.toBase58(),
          price:price,
          image:""
      }
    })

  const connection = new Connection(clusterApiUrl("devnet"));

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();

  const instruction = SystemProgram.transfer({
    fromPubkey: account,
    toPubkey: new PublicKey("EXBdeRCdiNChKyD7akt64n9HgSXEpUtpPEhmbnm4L6iH"),
    lamports: 0,
  });

  const tx = new Transaction({
    feePayer: account,
    blockhash,
    lastValidBlockHeight,
  });

  tx.add(instruction);

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
            description: "yes bro done",
            icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/330px-QR_code_for_mobile_English_Wikipedia.svg.png",
            label: "completed",
          },
        },
      },
    },
  });

  return Response.json(payload, { headers });
}

