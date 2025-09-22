import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import type { ChangeEvent } from "react";

interface RadioOption {
    value: string;
    label: string;
}

interface Props {
    options: RadioOption[];
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    selectedValue: string
}

export default function RadioButtonGroup({ options, onChange, selectedValue }: Props) {
    return (
        <FormControl>
            <RadioGroup onChange={onChange} value={selectedValue}>
                {options.map(({ value, label }) => (
                    <FormControlLabel key={label} value={value} control={<Radio />} label={label} />
                ))}
            </RadioGroup>
        </FormControl>
    )
}
