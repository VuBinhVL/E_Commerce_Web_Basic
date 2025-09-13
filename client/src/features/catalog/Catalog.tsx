import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";
import ProductList from "./ProductList";

export default function Catalog() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(productSelectors.selectAll);
  const { productLoaded, status } = useAppSelector(state => state.catalog);

  useEffect(() => {
    if (!productLoaded) dispatch(fetchProductsAsync());
  }, [dispatch, productLoaded]);

  if (status === 'pendingFetchProducts') return <LoadingComponent message="Loading products..." />;
  return (
    <>
      <ProductList products={products} />
    </>
  );
}
