import { NextApiRequest, NextApiResponse } from 'next'
import appIdMiddleware from '@/middleware/appIdMiddleware'
import {RadarrAPI} from "@/common/api/RadarrApi"

export type NextApiRequestWithApi = NextApiRequest & {api: RadarrAPI}

export default function withApi(
  handler: (req: NextApiRequestWithApi, { params }: { params: { id: string } }) => any | Promise<any>
) {
  return async (req: NextApiRequestWithApi, { params }: { params: { id: string } }) => {
    await appIdMiddleware(req, {params})
    return handler(req, {params})
  }
}

