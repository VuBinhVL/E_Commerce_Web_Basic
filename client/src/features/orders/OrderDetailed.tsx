import { Box, Button, Grid, Typography } from "@mui/material";
import BasketSummary from "../basket/BasketSummary";
import BasketTable from "../basket/BasketTable";
import type { Order } from "../../app/models/order";
import type { BasketItem } from "../../app/models/basket";

interface Props {
    order: Order;
    setSelectedOrder: (id: number) => void;
}

export default function OrderDetailed({ order, setSelectedOrder }: Props) {
    const subtotal = order.orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    return (
        <>
            <Box display={'flex'} justifyContent='space-between'>
                <Typography sx={{ p: 2 }} variant="h4" gutterBottom>Order #{order.id}</Typography>
                <Button sx={{ m: 2 }} variant="contained" size="large" color="primary" onClick={() => setSelectedOrder(0)}>Back</Button>
            </Box>
            <BasketTable items={order.orderItems as unknown as BasketItem[]} basket={false} />
            <Grid container>
                <Grid item xs={6} />
                <Grid item xs={6}>
                    <BasketSummary subtotal={subtotal} />
                </Grid>
            </Grid>
        </>
    )
}
