import { BlinksightsClient } from "blinksights-sdk";
import {
  ActionError,
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  createActionHeaders,
  createPostResponse,
} from "@solana/actions";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { generateHeatmap } from "./fn";
import { v2 as cloudinary } from "cloudinary";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

const headers = createActionHeaders();
const client = new BlinksightsClient(
  "a9e2501f12e4cb1629dea926636f0615d9e107b4b3ac9385b3bac58d1c3ae52a"
);
cloudinary.config({
  cloud_name: "dbe4r5mep",
  api_key: "889519336515641",
  api_secret: "MKx40Z2QYku1BokxfAe45JrhwTc",
});

async function upload(img_data: any, stat_account: string) {
  try {
    const options = {
      public_id: stat_account,
    };
    const uploadResult = await cloudinary.uploader.upload(img_data, options);
    return uploadResult.secure_url;
  } catch (error) {
    console.error(error);
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const payload: ActionGetResponse = {
    type: "action",
    title: "Solana wallet Activity",
    description:
      "Check your solana transaction activity from last one year and mint the transaction heatmap NFT easily using this blink",
    label: "stats",
    icon: "https://blinks-shopify.onrender.com/stats.png",
    links: {
      actions: [
        {
          label: "0.01 SOL",
          href: "/api/actions/stats?account={account}&token=SOL",
          parameters: [
            {
              label: "Enter wallet address manually and pay",
              type: "text",
              name: "account",
            },
          ],
        },
        {
          href: "/api/actions/stats?token=SEND",
          label: "50 SEND",
        },
        {
          href: "/api/actions/stats>token=USDC",
          label: "1 USDC",
        },
        {
          href: "/api/actions/stats?token=SOL",
          label: "0.01SOL",
        },
      ],
    },
  };
  return Response.json(payload, { headers });
}

export const OPTIONS = GET;

export async function POST(req: Request) {
  const body: ActionPostRequest = await req.json();
  const url = new URL(req.url);

  let stat_account: PublicKey | null = url.searchParams.get("account")
    ? new PublicKey(url.searchParams.get("account")!)
    : null;

  let account: PublicKey;
  try {
    account = new PublicKey(body.account);
  } catch (err) {
    return new Response('Invalid "account" provided', {
      status: 400,
      headers,
    });
  }
  client.trackActionV2(account.toString(), req.url);

  if (!stat_account) {
    stat_account = account;
  }

  if (stat_account === SystemProgram.programId) {
    return new Response('Invalid "account" provided', {
      status: 400,
      headers,
    });
  }

  const provider = new Connection(
    // "https://devnet.helius-rpc.com/?api-key=20475b23-b7f2-46be-badc-ad4f62baf079"
    "https://mainnet.helius-rpc.com/?api-key=20475b23-b7f2-46be-badc-ad4f62baf079"
  );

  let totalTx = 0;
  let oldestSignature;

  const dates: number[] = [];

  const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;
  const oneYearAgo = Math.floor(Date.now() / 1000) - ONE_YEAR_IN_SECONDS;

  while (true) {
    try {
      const signatures = await provider.getSignaturesForAddress(stat_account, {
        before: oldestSignature,
        limit: 1000,
      });
      if (signatures.length === 0) break;
      totalTx += signatures.length;
      console.log(signatures.length);

      let stopLoop = false;

      for (const sig of signatures) {
        if (sig.blockTime) {
          if (sig.blockTime < oneYearAgo) {
            stopLoop = true;
            break;
          }
          dates.push(sig.blockTime);
        }
      }

      if (stopLoop) break;
      oldestSignature = signatures[signatures.length - 1].signature;
    } catch (err) {
      console.log(err);
      break;
    }
  }
  const heatmapDataUri = generateHeatmap(dates);

  const imageUrl = await upload(heatmapDataUri, stat_account.toString());
  console.log(imageUrl);

  const { blockhash, lastValidBlockHeight } =
    await provider.getLatestBlockhash();

  const toPubkey: PublicKey = new PublicKey(
    "EXBdeRCdiNChKyD7akt64n9HgSXEpUtpPEhmbnm4L6iH"
  );

  const tx = new Transaction({
    feePayer: account,
    blockhash,
    lastValidBlockHeight,
  });

  const token = url.searchParams.get("token");
  if (token === "SOL") {
    const instruction = SystemProgram.transfer({
      fromPubkey: account,
      toPubkey,
      lamports: 0.01 * LAMPORTS_PER_SOL,
    });

    tx.add(instruction);
  }

  if (token === "SEND") {
    const mint_address = new PublicKey(
      "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa"
      // "9jyEAn15hMY7f5iKdUTPE5ZGaxD4BfsbHggwHFYvgF61"
    );
    const to = await getAssociatedTokenAddress(mint_address, toPubkey);

    try {
      var from = await getAssociatedTokenAddress(mint_address, account);
      const tokenAccount = await provider.getTokenAccountBalance(from);

      if (tokenAccount.value.uiAmount! < 50) {
        let message = "You don't have enough SEND tokens to Pay";
        return Response.json({ message } as ActionError, {
          status: 403,
          headers,
        });
      }
    } catch (err) {
      console.log(err);
      let message =
        "Oops You don't have SEND Token in your wallet. Buy some SEND Token first and then get your tx activity heatmap";
      return Response.json({ message } as ActionError, {
        status: 403,
        headers,
      });
    }

    const instruction = createTransferInstruction(
      from,
      to,
      account,
      50 * 1_000_000
    );

    tx.add(instruction);
  }

  if (token === "USDC") {
    const mint_address = new PublicKey(
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    );
    const to = await getAssociatedTokenAddress(mint_address, toPubkey);

    try {
      var from = await getAssociatedTokenAddress(mint_address, account);
      const tokenAccount = await provider.getTokenAccountBalance(from);

      if (tokenAccount.value.uiAmount! < 1) {
        let message = "You don't have enough USDC tokens to Pay";
        return Response.json({ message } as ActionError, {
          status: 403,
          headers,
        });
      }
    } catch (err) {
      console.log(err);
      let message =
        "Oops You don't have USDC Token in your wallet. Buy some USDC Token first and then get your tx activity heatmap";
      return Response.json({ message } as ActionError, {
        status: 403,
        headers,
      });
    }

    const instruction = createTransferInstruction(
      from,
      to,
      account,
      1 * 1_000_000
    );

    tx.add(instruction);
  }

  const payload: ActionPostResponse = await createPostResponse({
    fields: {
      transaction: tx,
      message: `you have done a overall of ${totalTx} transactions`,
      links: {
        next: {
          href: `/api/actions/stats/next-action?account=${stat_account}`,
          type: "post",
        },
      },
    },
  });
  return Response.json(payload, { headers });
}
