import {RadarrAPI} from "@/common/api/Radarr/api"

export async function POST(req: Request) {
  const  {url, api_key} = await req.json()
  const api = new RadarrAPI({
    apiKey: api_key,
    baseUrl: url
  })
  const resp = await api.system.getStatus()

  return Response.json(resp.data, {status: resp.status})
}