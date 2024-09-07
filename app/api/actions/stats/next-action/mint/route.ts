// import {
//   createActionHeaders,
//   NextActionPostRequest,
//   ActionError,
//   CompletedAction,
//   ActionPostResponse,
//   createPostResponse,
// } from "@solana/actions";
// import {
//   clusterApiUrl,
//   Connection,
//   Keypair,
//   LAMPORTS_PER_SOL,
//   PublicKey,
//   SystemProgram,
//   Transaction,
// } from "@solana/web3.js";

import { NextResponse } from "next/server";

// import wallet from "../../../../../../wallet.json";
// import { createNFT_GIT } from "../nft";
// import {
//   getAssociatedTokenAddress,
//   getOrCreateAssociatedTokenAccount,
//   transfer,
// } from "@solana/spl-token";
// const headers = createActionHeaders();

// export const GET = async (req: Request) => {
//   return Response.json({ message: "Method not supported" } as ActionError, {
//     status: 403,
//     headers,
//   });
// };

// export const OPTIONS = async () => Response.json(null, { headers });

// export const POST = async (req: Request) => {
//   try {
//     const url = new URL(req.url);
//     const stat_account = url.searchParams.get("account");

//     const body: NextActionPostRequest = await req.json();

//     const myAccount = Keypair.fromSecretKey(new Uint8Array(wallet));
//     let account: PublicKey;
//     try {
//       account = new PublicKey(body.account);
//     } catch (err) {
//       return new Response('Invalid "account" provided', {
//         status: 400,
//         headers,
//       });
//     }
//     const provider = new Connection(
//       "https://devnet.helius-rpc.com/?api-key=20475b23-b7f2-46be-badc-ad4f62baf079",
//       // "https://mainnet.helius-rpc.com/?api-key=20475b23-b7f2-46be-badc-ad4f62baf079",
//       { commitment: "confirmed" }
//     );

//     const nft = await createNFT_GIT(stat_account!);
//     const mint_address = new PublicKey(nft?.publicKey!);

//     const from = await getAssociatedTokenAddress(
//       mint_address,
//       myAccount.publicKey
//     );

//     const to = await getOrCreateAssociatedTokenAccount(
//       provider,
//       myAccount,
//       mint_address,
//       account
//     );

//     const tx = await transfer(
//       provider,
//       myAccount,
//       from,
//       to.address,
//       myAccount,
//       1
//     );

//     console.log(tx);

//     const { blockhash, lastValidBlockHeight } =
//       await provider.getLatestBlockhash();

//     const instruction = SystemProgram.transfer({
//       fromPubkey: account,
//       toPubkey: myAccount.publicKey,
//       lamports: 0.001 * LAMPORTS_PER_SOL,
//     });

//     const t1 = new Transaction({
//       feePayer: account,
//       blockhash,
//       lastValidBlockHeight,
//     }).add(instruction);

//     const payload1: ActionPostResponse = await createPostResponse({
//       fields: {
//         transaction: t1,
//         message: `You have successful minted the NFT. Please Check Your wallet on devnet`,
//       },
//       options: {
//         commitment: "confirmed",
//       },
//     });

//     return Response.json(payload1, {
//       headers,
//     });
//   } catch (err) {
//     console.log(err);
//     let actionError: ActionError = { message: "An unknown error occurred" };
//     if (typeof err == "string") actionError.message = err;
//     return Response.json(actionError, {
//       status: 400,
//       headers,
//     });
//   }
// };
export function GET(){
  return NextResponse.json("hellow")
}