import { PrismaClient } from "@prisma/client";
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
import axios from "axios";

const headers = createActionHeaders();
const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const data = await prisma.solMeet.findUnique({
    where: {
      id: id!,
    },
  });

  let slotdata = {
    json: {
      usernameList: ["thrishank"],
      eventTypeSlug: "15min",
      startTime: "2024-09-13T18:30:00.000Z",
      endTime: "2024-10-30T18:29:59.999Z",
      timeZone: "Asia/Calcutta",
    },
  };
  const cal_url =
    "https://cal.com/api/trpc/public/slots.getSchedule?input=" +
    encodeURIComponent(JSON.stringify(slotdata));

  const res = await axios.get(cal_url);
  let slotData = res.data.result.data.json.slots;
  let slotObjects = createSlotObjects(slotData);
  console.log(slotObjects.length);
  try {
    const payload: ActionGetResponse = {
      title: `${data!.title}`,
      description: `${data!.description}`,
      label: "Connect",
      icon: `${data!.image}`,
      type: "action",
      links: {
        actions: [
          {
            label: "labe 2 your wallet",
            href: "/api/actions/solmeet/create",
          },
          {
            label: "Connect your wallet",
            href: "/api/actions/solmeet/create",
            parameters: slotObjects,
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

async function getCokkie(username: string) {
  const res = await axios.get("https://cal.com/api/auth/session", {
    headers: {
      Referer: `https://cal.com/${username}`,
    },
  });
  // @ts-ignore
  return res.headers.get("set-cookie");
}

interface Slot {
  time: string;
}

interface SlotData {
  [date: string]: Slot[];
}

interface Option {
  label: string;
  value: string;
}

interface ActionParameterSelectable<Type extends string> {
  type: Type; // Type is constrained to specific values like "select"
  label: string;
  options: Option[];
  name: string;
}

// Define the specific type for 'select'
type SelectActionParameter = ActionParameterSelectable<"select">;

const createSlotObjects = (slots: SlotData): SelectActionParameter[] => {
  return Object.entries(slots).reduce<SelectActionParameter[]>(
    (acc, [date, times]) => {
      if (times.length > 0) {
        acc.push({
          type: "select",
          label: `Select a slot for ${date}`,
          options: times.map((slot) => ({
            label: new Date(slot.time).toLocaleTimeString(),
            value: slot.time,
          })),
          name: date,
        });
      }
      return acc;
    },
    []
  );
};
