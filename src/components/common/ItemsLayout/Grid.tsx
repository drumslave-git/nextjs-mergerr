import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import styled from "@mui/material/styles/styled"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import {ReactElement, ReactNode, cloneElement, isValidElement} from "react"

export interface Item {
  id: number | string;
  title: string;
  image?: string;
}

export const GridCell = styled(Paper)(({ theme }) => ({
  textAlign: 'center',
  width: '100%',
  height: 'auto',
  overflow: 'hidden',
  padding: 0,
}))

export interface ItemComponentProps {
  item: Item;
  AdditionalContentComponent?: (props: {item: Item} & Record<string, any>) => ReactElement<any>;
  ActionComponent: (props: {item: Item, children: ReactNode} & Record<string, any>) => ReactElement<any>;
}

export function ItemComponent({item, AdditionalContentComponent, ActionComponent}: ItemComponentProps) {
  return <Card sx={{height: '100%', position: 'relative'}} raised>
    <CardContent sx={{height: '100%'}}>
      <ActionComponent item={item}>
        <CardMedia image={item.image} title={item.title} sx={{height: '100%'}} />
        {AdditionalContentComponent && <AdditionalContentComponent item={item} />}
        <Typography paddingTop={theme => theme.spacing(2)} component="div">{item.title}</Typography>
      </ActionComponent>
    </CardContent>
  </Card>
}

export interface GridComponentProps {
  items: Item[];
  AdditionalContentComponent?: (props: {item: Item} & Record<string, any>) => ReactElement<any>;
  ActionComponent?: (props: {item: Item, children: ReactNode} & Record<string, any>) => ReactElement<any>;
  aspectRatio?: number
}

export function DefaultComponent({children}: {children?: ReactNode}) {
  return <Stack sx={{height: '100%'}}>{children}</Stack>
}

export default function GridComponent({items, aspectRatio = .7, AdditionalContentComponent, ActionComponent = DefaultComponent}: GridComponentProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        {items.map(item => (
          <Grid size={{xs: 12, sm: 6, md: 4, lg: 3}} key={item.id}>
            <GridCell sx={{aspectRatio}}>
              <ItemComponent item={item} AdditionalContentComponent={AdditionalContentComponent} ActionComponent={ActionComponent} />
            </GridCell>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}