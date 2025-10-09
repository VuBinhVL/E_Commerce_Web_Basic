import { Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";
import BasketSummary from "./BasketSummary";
import BasketTable from "./BasketTable";

export default function BasketPage() {
    const { basket } = useAppSelector(state => state.basket);

    if (!basket) return <Typography variant="h3">Your basket is empty</Typography>
    return (
        <>
            <BasketTable items={basket.items} basket={true} />
            <Grid container>
                <Grid item xs={6} />
                <Grid item xs={6}>
                    <BasketSummary />
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth color="primary"
                        component={Link} to='/checkout'>
                        Checkout
                    </Button>
                </Grid>
            </Grid>
        </>

    )
}
