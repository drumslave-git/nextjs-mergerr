'use client'

import {Movie} from "@/common/api/Radarr/entities/MovieAPI"
import MovieCard from "@/components/common/MovieCard"
import {useEffect, useState} from "react"

export default function QueueEntryPage({ params }: { params: { id: string, movieId: string } }) {
  const [record, setRecord] = useState<Movie | null>(null)

  useEffect(() => {
    fetch(`/api/app/${params.id}/movie/${params.movieId}`)
      .then(res => res.json()).then(setRecord)
  }, [params])

  if(!record) {
    return <div>Loading...</div>
  }
  return (
      <MovieCard movie={record} />
  )
}