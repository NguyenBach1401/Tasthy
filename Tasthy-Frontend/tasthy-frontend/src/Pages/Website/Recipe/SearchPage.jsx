import { useEffect, useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { searchRecipes } from "../../../Services/AppServices/RecipeService";

import {
    Box,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Stack,
    Button,
    Grid,
    CircularProgress,
    Pagination,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const PLACEHOLDER_IMG = "/assets/placeholder.png";
const PAGE_SIZE = 12;

const SearchPage = () => {

    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const scope = (params.get("scope") || "recipes").toLowerCase();
    const kw = params.get("kw") || params.get("q") || "";

    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => setPage(1), [kw, scope]);


    const fetchData = useCallback(async () => {
        if (scope !== "recipes") return;
        try {
            setLoading(true);
            const { recipes, totalRecords, error: apiError } = await searchRecipes(
                page,
                PAGE_SIZE,
                kw.trim()
            );
            if (apiError) throw new Error(apiError);
            setData(recipes);
            setTotal(totalRecords);
        } catch (err) {
            console.error(err);
            setError("Đã xảy ra lỗi khi tìm kiếm, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }, [page, kw, scope]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /* ------------------------ Handlers ---------------------------- */
    const handlePageChange = (_, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* ------------------------ Render ------------------------------ */
    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <Box sx={{ px: { xs: 2, md: 6, lg: 30 }, py: 4 }}>


            {loading && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Typography color="error" mt={2}>{error}</Typography>
            )}

            {!loading && !error && scope === "recipes" && (
                <>
                    {/* Grid: tối đa 4 món / hàng (md+) với card cố định 350px */}
                    <Grid
                        container
                        spacing={2}
                        justifyContent="center"
                    >
                        {data.map((r) => (
                            <Grid item xs={12} sm={6} md={3} key={r.recipeID} sx={{ display: "flex", justifyContent: "center" }}>
                                <Card
                                    sx={{
                                        width: 350,
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "100%",
                                        borderRadius: 3,
                                        boxShadow: 3,
                                    }}
                                >
                                    {/* Ảnh cố định chiều cao 300px, luôn cover */}
                                    <CardMedia
                                        component="img"
                                        image={r.recipeIMG || PLACEHOLDER_IMG}
                                        alt={r.title || "Ảnh món ăn"}
                                        sx={{
                                            width: "100%",
                                            height: 300,
                                            objectFit: "cover",
                                        }}
                                    />

                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography fontWeight="bold" noWrap mb={1}>{r.title || "Không có tiêu đề"}</Typography>
                                    </CardContent>

                                    <Box p={2} pt={0}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            component={Link}
                                            to={`/recipe/${r.recipeID}`}
                                            sx={{
                                                bgcolor: "#f87171",
                                                fontWeight: "bold",
                                                "&:hover": { bgcolor: "#ef4444" },
                                            }}
                                        >
                                            XEM CHI TIẾT
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {totalPages > 1 && (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default SearchPage;
