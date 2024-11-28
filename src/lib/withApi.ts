import {WhisparrAPI} from "@/common/api/Whisparr/api"
import appIdMiddleware from '@/middleware/appIdMiddleware'
import {RadarrAPI} from "@/common/api/Radarr/api"
import {NextRequest} from "next/server"

export type NextRequestWithApi = NextRequest & {api: RadarrAPI | WhisparrAPI}

export default function withApi(
  handler: (req: NextRequestWithApi, { params }: { params: { id: string } & Record<string, any> }) => any | Promise<any>
) {
  return async (req: NextRequestWithApi, { params }: { params: { id: string } & Record<string, any> }) => {
    await appIdMiddleware(req, {params})
    return handler(req, {params})
  }
}

