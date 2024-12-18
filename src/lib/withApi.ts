import {WhisparrAPI} from "@/common/api/Whisparr/api"
import {NextRequestWithMergerrApi} from "@/lib/withMergerrApi"
import appIdMiddleware from '@/middleware/appIdMiddleware'
import {RadarrAPI} from "@/common/api/Radarr/api"
import {NextRequest} from "next/server"

export type NextRequestWithApi = NextRequest & {api: RadarrAPI | WhisparrAPI}

export default function withApi(
  handler: (req: any, { params }: { params: { id: string } & any } & any) => any | Promise<any>
) {
  return async (req: NextRequestWithApi, { params, ...rest }: { params: { id: string } & any } & any) => {
    const { id } = await params
    await appIdMiddleware(req, id)
    return handler(req, {params, ...rest})
  }
}

