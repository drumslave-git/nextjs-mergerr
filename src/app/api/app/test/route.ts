import {ApiEndpoints, AppType} from "@/consts"

export async function POST(req: Request) {
  const  {type, url, api_key} = await req.json()
  const test = await fetch(`${url}${ApiEndpoints[type as AppType].status.uri}?apiKey=${api_key}`, {
    method: 'GET',
    headers: {
      'X-Api-Key': api_key,
    },
  })

  return Response.json(await test.json(), {status: test.status})
}