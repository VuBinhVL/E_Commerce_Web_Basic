import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { type FieldValues } from "react-hook-form";
import { agent } from "../../app/api/agent";
import type { User } from "../../app/models/user";
import { router } from "../../app/router/Routes";
import { toast } from "react-toastify";
import { setBasket } from "../basket/basketSlice";

interface AccountState {
    user: User | null;
}

const initialState: AccountState = {
    user: null
}

export const SignInUser = createAsyncThunk<User, FieldValues>(
    'account/SignInUser',
    async (data, thunkAPI) => {
        try {
            const userDto = await agent.Account.login(data);
            const { basket, ...user } = userDto;
            if (basket) {
                thunkAPI.dispatch(setBasket(basket));
            }
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        }
        catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue({ error: error });
        }
    }
);

export const fetchCurrentUser = createAsyncThunk<User>(
    'account/fetchCurrentUser',
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));
        try {
            const userDto = await agent.Account.currentUser();
            const { basket, ...user } = userDto;
            if (basket) {
                thunkAPI.dispatch(setBasket(basket));
            }
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        }
        catch (error) {
            return thunkAPI.rejectWithValue({ error: error });
        }
    },
    {
        condition: () => {
            if (!localStorage.getItem('user')) return false;
        }
    }
);

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        logOut: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            router.navigate('/');
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchCurrentUser.rejected, (state) => {
            state.user = null;
            localStorage.removeItem('user');
            toast.error('Session expired - please login again');
            router.navigate('/');

        });
        builder.addCase(SignInUser.rejected, (_state, action) => {
            throw action.payload;
        });
        builder.addMatcher(isAnyOf(SignInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            state.user = action.payload;
        });
    })
})

export const { logOut, setUser } = accountSlice.actions;
