import { debounce, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { useState } from "react";
import { setProductParams } from "./catalogSlice";

export default function SearchTerm() {
    const { productParams } = useAppSelector(state => state.catalog)
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);
    const debounceSearch = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setProductParams({ searchTerm: event.target.value }))
    }, 1000);

    return (
        <TextField
            label="Search Products"
            variant="outlined"
            fullWidth
            value={searchTerm || ''}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSearchTerm(event.target.value);
                debounceSearch(event)
            }} />
    )
}
