import {MergerrAPI} from "@/common/api/Mergerr/api"
import mergerrMiddleware from "@/middleware/mergerrMiddleware"
import {NextRequest} from "next/server"

export type NextRequestWithMergerrApi = NextRequest & {mergerrAPI: MergerrAPI}

export default function withMergerrApi(
  handler: (req: NextRequestWithMergerrApi, { params }: { params: { id: string } & any } & any) => any | Promise<any>
) {
  return async (req: NextRequestWithMergerrApi, { params, ...rest }: { params: { id: string } & any } & any) => {
    const { id } = await params
    await mergerrMiddleware(req, id)
    return handler(req, {params, ...rest})
  }
}

