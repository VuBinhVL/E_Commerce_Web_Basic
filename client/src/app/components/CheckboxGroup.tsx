import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";

interface Props {
    items: string[];
    checked?: string[];
    onChange: (item: string[]) => void
}

export default function CheckboxGroup({ items, checked, onChange }: Props) {
    const [checkItems, setCheckItems] = useState(checked || []);
    function handleChecked(value: string) {
        const currentIndex = checkItems.findIndex(item => item === value);
        let newChecked: string[] = [];
        if (currentIndex === -1)
            newChecked = [...checkItems, value];
        else
            newChecked = checkItems.filter(item => item !== value);
        setCheckItems(newChecked);
        onChange(newChecked);
    }

    return (
        <FormGroup>
            {items.map(item => (
                <FormControlLabel key={item}
                    control={<Checkbox
                        checked={checkItems.indexOf(item) !== -1}
                        onChange={() => handleChecked(item)}
                    />}
                    label={item} />
            ))}
        </FormGroup>
    )
}
