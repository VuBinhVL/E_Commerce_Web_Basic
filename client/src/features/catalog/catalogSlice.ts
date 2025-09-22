import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { agent } from "../../app/api/agent";
import type { Product, ProductParams } from "../../app/models/product";
import type { RootState } from "../../app/store/configureStore";
import type { MetaData } from "../../app/models/pagination";

interface CatalogState {
    productLoaded: boolean,
    filtersLoaded: boolean,
    status: string,
    brands: string[],
    types: string[],
    productParams: ProductParams,
    metaData: MetaData | null
}

const productAdapter = createEntityAdapter<Product>();

function getAxiosParams(productParams: ProductParams) {
    const params = new URLSearchParams();
    params.append('pageNumber', productParams.pageNumber.toString());
    params.append('pageSize', productParams.pageSize.toString());
    params.append('orderBy', productParams.orderBy);
    if (productParams.searchTerm) params.append('searchTerm', productParams.searchTerm);
    if (productParams.brands.length > 0) params.append('brands', productParams.brands.toString());
    if (productParams.types.length > 0) params.append('types', productParams.types.toString());
    return params;
}

export const fetchProductsAsync = createAsyncThunk<Product[], void, { state: RootState }>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().catalog.productParams)
        try {
            const response = await agent.Catalog.list(params);
            thunkAPI.dispatch(setMetaData(response.metaData));
            return response.items;
        }
        catch (error) {
            return thunkAPI.rejectWithValue({ error: error });
        }
    }
)

export const fetchProductAsync = createAsyncThunk<Product, number>(
    'catalog/fetchProductAsync',
    async (productId, thunkAPI) => {
        try {
            return await agent.Catalog.details(productId);
        }
        catch (error) {
            return thunkAPI.rejectWithValue({ error: error });
        }
    }
)

export const fetchFiltersAsync = createAsyncThunk(
    'catalog/fetchFiltersAsync',
    async (_, thunkAPI) => {
        try {
            return await agent.Catalog.filters();
        }
        catch (error) {
            return thunkAPI.rejectWithValue({ error: error });
        }
    }
)

function initParams() {
    return {
        pageSize: 6,
        pageNumber: 1,
        orderBy: 'name',
        types: [],
        brands: [],
    }

}

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productAdapter.getInitialState<CatalogState>({
        productLoaded: false,
        filtersLoaded: false,
        status: 'idle',
        brands: [],
        types: [],
        productParams: initParams(),
        metaData: null
    }),
    reducers: {
        setProductParams: (state, action) => {
            state.productLoaded = false;
            state.productParams = { ...state.productParams, ...action.payload, pageNumber: 1 };
        },
        setPageNumber: (state, action) => {
            state.productLoaded = false;
            state.productParams = { ...state.productParams, ...action.payload };
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload;
        },
        resetProductParams: (state) => {
            state.productParams = initParams()
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = 'pendingFetchProducts';
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.productLoaded = true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state, action) => {
            console.log(action);
            state.status = 'idle';
        });
        builder.addCase(fetchProductAsync.pending, (state) => {
            state.status = 'pendingFetchProduct';
        });
        builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
            productAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
        });
        builder.addCase(fetchProductAsync.rejected, (state, action) => {
            console.log(action);
            state.status = 'idle';
        });
        builder.addCase(fetchFiltersAsync.pending, (state) => {
            state.status = 'pendingFetchFilters';
        });
        builder.addCase(fetchFiltersAsync.fulfilled, (state, action) => {
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.filtersLoaded = true;
            state.status = 'idle';
        });
        builder.addCase(fetchFiltersAsync.rejected, (state, action) => {
            console.log(action);
            state.status = 'idle';
        });
    })
});

export const productSelectors = productAdapter.getSelectors((state: RootState) => state.catalog);

export const { setProductParams, resetProductParams, setMetaData, setPageNumber } = catalogSlice.actions;