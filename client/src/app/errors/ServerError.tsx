import { Container, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function ServerError() {
    const { state } = useLocation();
    return (
        <Container component={Paper} sx={{ height: 400 }}>
            {
                state?.error ? (
                    <>
                        <Typography variant="h5" gutterBottom color="secondary">{state.error.title}</Typography>
                        <Divider />
                        <Typography variant="body1">{state.error.detail || "Internal Server Error"}</Typography>
                    </>
                ) : (
                    <Typography variant="h5" gutterBottom color="error">Unknown server error</Typography>
                )
            }
        </Container>
    )
}