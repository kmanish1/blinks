import { createActionHeaders, ActionError, NextAction } from "@solana/actions";
import QRCode from "qrcode";

const headers = createActionHeaders();

export const GET = async (req: Request) => {
  return Response.json({ message: "Method not supported" } as ActionError, {
    status: 403,
    headers,
  });
};

export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
  try {
    const url = new URL(req.url);

    const stat_account = url.searchParams.get("account");
    const link = `https://res.cloudinary.com/dbe4r5mep/image/upload/v1725111275/ ${stat_account}.png`;

    const qrCodeDataUrl = await generateQRCodeForImageDownload(link);

    const payload: NextAction = {
      type: "action",
      title: "mint the NFT for 0.001 SOL",
      icon: `https://res.cloudinary.com/dbe4r5mep/image/upload/v1725111275/${stat_account}.png`,
      label: "Complete!",
      description: `Here is your image url ${link}`,
      links: {
        actions: [
          {
            label: "Mint as NFT",
            href: `/api/actions/stats/next-action/mint?account=${stat_account}`,
          },
        ],
      },
    };

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    let actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
};

async function generateQRCodeForImageDownload(imageUrl: string) {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(imageUrl);
    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
}
