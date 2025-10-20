/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InputBaseComponentProps } from "@mui/material";
import { forwardRef, useImperativeHandle, useRef, type Ref } from "react";

interface Props extends InputBaseComponentProps { }

export const StripeInput = forwardRef(function StripeInput({ component: Component, ...props }: Props,
    ref: Ref<unknown>) {
    const elementRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
        focus: () => {
            elementRef.current?.focus();
        }
    }));

    return <Component onReady={(element: any) => elementRef.current = element} {...props} />;
});
