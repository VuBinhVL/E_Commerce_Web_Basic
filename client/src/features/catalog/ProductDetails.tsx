import { LoadingButton } from "@mui/lab";
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState, type ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { formatCurrency } from "../../app/util/util";
import { addBasketItemAsync, removeBasketItemAsync } from "../basket/basketSlice";
import { fetchProductAsync, productSelectors } from "./catalogSlice";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { status: productStatus } = useAppSelector(state => state.catalog);
  const product = useAppSelector(state => productSelectors.selectById(state, Number(id)));
  const [quantity, setQuantity] = useState(0);
  const { basket, status } = useAppSelector(state => state.basket);
  const dispatch = useAppDispatch();
  const item = basket?.items.find((i) => i.productId === Number(id));

  useEffect(() => {
    if (item) setQuantity(item.quantity);
    if (!product && id) {
      dispatch(fetchProductAsync(Number(id)));
    }
  }, [id, item, dispatch, product]);

  if (productStatus === 'pendingFetchProduct') return <LoadingComponent message="Loading product..." />;
  if (!product) return <NotFound />;

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (parseInt(event.currentTarget.value) >= 0) {
      setQuantity(parseInt(event.currentTarget.value));
    }
  }
  function handleUpdateCart() {
    if (!product) return;

    if (!item || quantity > item.quantity) {
      const updateQuantity = item ? quantity - item.quantity : quantity;
      dispatch(addBasketItemAsync({ productId: product.id, quantity: updateQuantity }));
    }
    else {
      const updateQuantity = item.quantity - quantity;
      dispatch(removeBasketItemAsync({ productId: product.id, quantity: updateQuantity }));
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: "100%" }}
        />
      </Grid>

      <Grid item xs={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider />
        <Typography variant="h4" color="secondary">
          {formatCurrency(product.price)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantity in Stock</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Quantity in Cart"
              type="number"
              variant="outlined"
              fullWidth
              value={quantity}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              disabled={item?.quantity === quantity || (!item && quantity === 0)}
              onClick={handleUpdateCart}
              loading={status.includes('pending' + product.id)}
              sx={{ height: "55px" }}
              color="primary" size="large"
              variant="contained" fullWidth>
              {item ? "Update Quantity" : "Add to Cart"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
