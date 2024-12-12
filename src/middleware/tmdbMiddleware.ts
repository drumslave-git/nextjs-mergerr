import {TMDBApi} from "@/common/api/TMDB/api"
import {prisma} from "@/lib/prisma"
import {NextRequest} from "next/server"

export type NextRequestWithTMDBApi = NextRequest & {tmdbAPI: TMDBApi}

export default async function tmdbMiddleware(req: NextRequestWithTMDBApi){
  let tmdbConfig: any = {}
  try {
    tmdbConfig = await prisma.tMDB.findFirst()
  } catch (e) {
    console.error(e)
  }

  req.tmdbAPI = new TMDBApi(tmdbConfig?.key)
}