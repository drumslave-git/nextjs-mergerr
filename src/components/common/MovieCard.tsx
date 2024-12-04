'use client'

import {Movie} from "@/common/api/Radarr/entities/MovieAPI"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"

export default function MovieCard({movie} : {movie: Movie}) {
  return <Paper>
    <Typography variant="h5">{movie.title}</Typography>
  </Paper>
}