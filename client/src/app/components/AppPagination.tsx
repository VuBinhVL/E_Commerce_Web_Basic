import { Box, Typography, Pagination } from "@mui/material";
import type { MetaData } from "../models/pagination"

interface Props {
    metaData: MetaData;
    onPageChange: (page: number) => void;
}

export default function AppPagination({ metaData, onPageChange }: Props) {
    const { currentPage, totalPages, totalCount, pageSize } = metaData
    return (
        <Box display={"flex"} justifyContent="right" alignItems="center">
            <Typography>
                Display {(currentPage - 1) * pageSize + 1} -
                {currentPage * pageSize > totalCount
                    ? totalCount :
                    currentPage * pageSize} of {totalCount} products
            </Typography>
            <Pagination
                color="secondary"
                size="large"
                count={totalPages}
                page={currentPage}
                onChange={(_e, page: number) => onPageChange(page)} />
        </Box>
    )
}
