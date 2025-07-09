import { Card, CardActionArea, CardContent, Typography } from "@mui/material"
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom"

interface HomeNavigateCardProps {
    children: ReactNode,
    route: string
}

function HomeNavigateCard({ children, route } : HomeNavigateCardProps) {

    const navigate = useNavigate();

    return (
        <Card
      sx={{
        height: "100%",
        backgroundColor: "var(--card)",
        borderRadius: 3,
        boxShadow: 6,
        px: 4
      }}
    >
      <CardActionArea onClick={() => navigate(route)}>
        <CardContent>
          <Typography
            variant="h6"
            align="center"
            sx={{ color: "var(--foreground-text)" }}
          >
            {children}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
     )
}

export default HomeNavigateCard