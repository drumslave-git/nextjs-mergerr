import {TMDBApi} from "@/common/api/TMDB/api"
import {prisma} from "@/lib/prisma"
import {NextRequest} from "next/server"

export type NextRequestWithTMDBApi = NextRequest & {tmdbAPI: TMDBApi}

export default async function tmdbMiddleware(req: NextRequestWithTMDBApi){
  const tmdbConfig = await prisma.tMDB.findFirst()

  req.tmdbAPI = new TMDBApi(tmdbConfig?.key)
}