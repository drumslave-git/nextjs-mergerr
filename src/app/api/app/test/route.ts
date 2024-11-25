import {RadarrAPI} from "@/common/api/RadarrApi"

export async function POST(req: Request) {
  const  {url, api_key} = await req.json()
  const api = new RadarrAPI({
    apiKey: api_key,
    baseUrl: url
  })

  return Response.json(await api.system.getStatus())
}