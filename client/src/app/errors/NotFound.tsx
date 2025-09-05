import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

export default function NotFound() {
    return (
        <Container component={Paper} sx={{ height: 400 }}>
            <Typography variant="h3" color="error" gutterBottom>The page you are looking for was not found</Typography>
            <Divider />
            <Button fullWidth component={NavLink} to="/catalog">Go back to shop</Button>
        </Container>
    )
}
