import {TPDBApi} from "@/common/api/TPDB/api"
import {prisma} from "@/lib/prisma"
import {NextRequest} from "next/server"

export type NextRequestWithTPDBApi = NextRequest & {tpdbAPI: TPDBApi}

export default async function tpdbMiddleware(req: NextRequestWithTPDBApi){
  let tmdbConfig: any = {}
  try {
    tmdbConfig = await prisma.tPDB.findFirst()
  } catch (e) {
    console.error(e)
  }

  req.tpdbAPI = new TPDBApi(tmdbConfig?.key)
}