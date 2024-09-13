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
  
  const headers = createActionHeaders();
  const prisma=new PrismaClient();

// async function data(username:string,slug:string){
//   const res = await fetch(`https://cal.com/api/trpc/public/slots.getSchedule?input=%7B%22json%22%3A%7B%22isTeamEvent%22%3Afalse%2C%22usernameList%22%3A%5B%22${username}%22%5D%2C%22eventTypeSlug%22%3A%22${slug}%22%2C%22startTime%22%3A%222024-08-31T18%3A30%3A00.000Z%22%2C%22endTime%22%3A%222024-09-30T18%3A29%3A59.999Z%22%2C%22timeZone%22%3A%22Asia%2FCalcutta%22%2C%22duration%22%3Anull%2C%22rescheduleUid%22%3Anull%2C%22orgSlug%22%3Anull%2C%22teamMemberEmail%22%3Anull%7D%2C%22meta%22%3A%7B%22values%22%3A%7B%22duration%22%3A%5B%22undefined%22%5D%2C%22orgSlug%22%3A%5B%22undefined%22%5D%2C%22teamMemberEmail%22%3A%5B%22undefined%22%5D%7D%7D%7D`, {
//       "headers": {
//         "accept": "*/*",
//         "accept-language": "en-IN,en;q=0.9",
//         "content-type": "application/json",
//         "priority": "u=1, i",
//         "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
//         "sec-ch-ua-mobile": "?0",
//         "sec-ch-ua-platform": "\"Windows\"",
//         "sec-fetch-dest": "empty",
//         "sec-fetch-mode": "cors",
//         "sec-fetch-site": "same-origin",
//         "cookie": "__Secure-next-auth.csrf-token=615e4e691fe9a0247af1854f10e9ec33a9d545dc76d07e5ae6e2e54cb8ba0ffa%7Ce20b5c268b7d8a02dea63e7caf94e194b9959d1edbf88eb984ef3e646e354696; Domain=.cal.com; Path=/; HttpOnly; Secure; SameSite=None",
//         "Referer": `https://cal.com/${username}/${slug}?date=2024-09-12`,
//         "Referrer-Policy": "strict-origin-when-cross-origin"
//       },
//       "body": null,
//       "method": "GET"
//     });
//   const data1 = await res.json();
//   console.log(data1.result.data.json.slots);
// }


  export async function GET(req:Request) {
    const url=new URL(req.url);
    const id=url.searchParams.get("id");
    const data=await prisma.solMeet.findUnique({
        where:{
            id:id!,
        }
    })
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
              label: "Connect your wallet",
              href: "/api/actions/solmeet/create",
              parameters: [
                {
                  type: "text",
                  label: "Enter your cal.com username",
                  name: "username",
                  required: true,
                },
                {
                  type:"select",
                  options:[
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    },
                    {
                      label:"afsd",
                      value:"fs"
                    }
                    

                  ],
                  name:"fsdaff"
                }
              ],
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