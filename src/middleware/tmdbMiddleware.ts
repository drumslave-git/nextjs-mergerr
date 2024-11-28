import {TMDBApi} from "@/common/api/TMDB/api"
import {prisma} from "@/lib/prisma"
import {NextRequest} from "next/server"

export type NextRequestWithTMDBApi = NextRequest & {tmdbAPI: TMDBApi}

export default async function tmdbMiddleware(req: NextRequestWithTMDBApi){
  const tmdbConfig = await prisma.tMDB.findFirst()
  if(!tmdbConfig){
    return Response.json({message: 'Missing tmdb required parameters'}, {status: 402})
  }

  if(!tmdbConfig.key) {
    return Response.json({message: 'Missing tmdb key parameters'}, {status: 403})
  }

  req.tmdbAPI = new TMDBApi(tmdbConfig.key)
}