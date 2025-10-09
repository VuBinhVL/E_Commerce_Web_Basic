import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { formatCurrency } from "../../app/util/util";
import { removeBasketItemAsync, addBasketItemAsync } from "./basketSlice";
import type { BasketItem } from "../../app/models/basket";

interface Props {
    items: BasketItem[];
    basket?: boolean;
}

export default function BasketTable({ items, basket }: Props) {
    const { status } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} >
                <TableHead>
                    <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Total</TableCell>
                        {basket &&
                            <TableCell align="right"></TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item) => (
                        <TableRow
                            key={item.productId}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <Box display='flex' alignItems='center'>
                                    <img src={item.pictureUrl} alt={item.name} style={{ height: 50, marginRight: 20 }} />
                                    <span>{item.name}</span>
                                </Box>
                            </TableCell>
                            <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                            <TableCell align="center">
                                {basket &&
                                    <LoadingButton
                                        color="error"
                                        loading={status === 'pendingRemoveItem' + item.productId + 'remove'}
                                        onClick={() => dispatch(removeBasketItemAsync({ productId: item.productId, quantity: 1, name: 'remove' }))}>
                                        <Remove />
                                    </LoadingButton>}
                                {item.quantity}
                                {basket &&
                                    <LoadingButton
                                        color="secondary"
                                        loading={status === 'pendingAddItem' + item.productId}
                                        onClick={() => dispatch(addBasketItemAsync({ productId: item.productId }))}>
                                        <Add />
                                    </LoadingButton>}
                            </TableCell>
                            <TableCell align="right">{formatCurrency(item.price * item.quantity)}</TableCell>
                            <TableCell align="right">
                                {basket &&
                                    <LoadingButton
                                        color="error"
                                        loading={status === 'pendingRemoveItem' + item.productId + 'delete'}
                                        onClick={() => dispatch(removeBasketItemAsync({ productId: item.productId, quantity: item.quantity, name: 'delete' }))}>
                                        <Delete />
                                    </LoadingButton>}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
