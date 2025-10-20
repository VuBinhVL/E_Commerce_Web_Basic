import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import { useAppDispatch } from "../../app/store/configureStore";
import { useEffect, useState } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { agent } from "../../app/api/agent";
import { setBasket } from "../basket/basketSlice";

const stripePromise = loadStripe('pk_test_51SIQMwKKgvvjoFWaXzbLdDMSZYTOi0C9zNEC34a6vOWxrihd5VqTIQRTAKPGjUQW5ljWtZNphKKUew8cnC8oB9FY00CU4rFbA2');

export default function CheckoutWrapper() {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        agent.Payments.createPaymentIntent()
            .then(basket => dispatch(setBasket(basket)))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [dispatch]);

    if (loading) return <LoadingComponent message="Processing order..." />
    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage />
        </Elements>
    )
}
