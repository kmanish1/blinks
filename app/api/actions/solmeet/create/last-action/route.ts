import {
    Action,
    ActionError,
    ActionPostRequest,
    createActionHeaders,
    NextAction,
  } from "@solana/actions";
import { clusterApiUrl, Connection, PublicKey, SystemProgram } from "@solana/web3.js";
  
  const headers = createActionHeaders();
  
  export const GET = async (req: Request) => {
    return Response.json({ message: "Method not supported" } as ActionError, {
      status: 403,
      headers,
    });
  };
  
  export const OPTIONS = async () => Response.json(null, { headers });
  
  export async function POST(req: Request) {
    const body:ActionPostRequest=await req.json();
    //@ts-ignore
    const arr=body.data.meetid.split(",");
    console.log(arr);
    
    const payload: NextAction = {
      type: "completed",
      title: "Generate Blink",
      label: "abcd edf",
      description: "this is the only description",
      icon: "https://cal.com/_next/image?url=https%3A%2F%2Fwww.datocms-assets.com%2F77432%2F1685376092-no-show-fee.png&w=1200&q=75",
    };
    return Response.json(payload, { headers });
  }
  