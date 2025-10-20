/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid, TextField, Typography } from "@mui/material";
import { CardCvcElement, CardExpiryElement, CardNumberElement } from "@stripe/react-stripe-js";
import type { StripeElementType } from "@stripe/stripe-js";
import { useFormContext } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import { StripeInput } from "./stripeInput";

interface Props {
    cardState: { elementError: { [key in StripeElementType]?: string } };
    onCardChangeInput: (event: any) => void;
}
export default function PaymentForm({ cardState, onCardChangeInput }: Props) {
    const { control } = useFormContext();

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Payment method
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <AppTextInput label="Name on card" name="nameOnCard" control={control} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        onChange={onCardChangeInput}
                        error={!!cardState.elementError.cardNumber}
                        helperText={cardState.elementError.cardNumber}
                        id="cardNumber"
                        label="Card number"
                        fullWidth
                        autoComplete="cc-number"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            inputComponent: StripeInput,
                            inputProps: {
                                component: CardNumberElement
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        onChange={onCardChangeInput}
                        error={!!cardState.elementError.cardExpiry}
                        helperText={cardState.elementError.cardExpiry}
                        id="expDate"
                        label="Expiry date"
                        fullWidth
                        autoComplete="cc-exp"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            inputComponent: StripeInput,
                            inputProps: {
                                component: CardExpiryElement
                            }
                        }} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        onChange={onCardChangeInput}
                        error={!!cardState.elementError.cardCvc}
                        helperText={cardState.elementError.cardCvc}
                        id="cvv"
                        label="CVV"
                        fullWidth
                        autoComplete="cc-csc"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            inputComponent: StripeInput,
                            inputProps: {
                                component: CardCvcElement
                            }
                        }} />
                </Grid>

            </Grid>
        </>
    );
}