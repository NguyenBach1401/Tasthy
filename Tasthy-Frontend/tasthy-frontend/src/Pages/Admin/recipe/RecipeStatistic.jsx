import React, { useEffect, useState } from 'react';
import {
    Box, Button, FormControl, MenuItem, Pagination, Paper, Tab, Tabs,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, IconButton, Tooltip
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { getAllRecipesForAdmin, getRecipesWithoutNutrition, getRecipeDetailForAdmin } from '../../../Services/AdminServices/AdminRecipeService';
import RecipeDetailModal from './RecipeDetail';
import AddRecipeModal from './addRecipe';
import EditRecipeModal from './editRecipe';

const PAGE_SIZES = [5, 10, 20, 50];

const RecipeAdminTabs = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);
    const [recipeDetail, setRecipeDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [errorDetail, setErrorDetail] = useState(null);


    const [openAddModal, setOpenAddModal] = useState(false);
    const [editOpen, setEditOpen] = useState(false);


    // Tab 1 - all recipes
    const [recipesAll, setRecipesAll] = useState([]);
    const [totalAll, setTotalAll] = useState(0);
    const [pageAll, setPageAll] = useState(1);
    const [pageSizeAll, setPageSizeAll] = useState(10);
    const [keywordAll, setKeywordAll] = useState('');

    // Tab 2 - recipes without nutrition
    const [recipesNoNutri, setRecipesNoNutri] = useState([]);
    const [totalNoNutri, setTotalNoNutri] = useState(0);
    const [pageNoNutri, setPageNoNutri] = useState(1);
    const [pageSizeNoNutri, setPageSizeNoNutri] = useState(10);
    const [keywordNoNutri, setKeywordNoNutri] = useState('');

    // Load data for tab 1
    const loadAllRecipes = async () => {
        try {
            const res = await getAllRecipesForAdmin(pageAll, pageSizeAll, keywordAll);
            setRecipesAll(res.recipes);
            setTotalAll(res.totalRecords);
        } catch (error) {
            console.error('Lỗi load tất cả món:', error);
            setRecipesAll([]);
            setTotalAll(0);
        }
    };

    // Load data for tab 2
    const loadNoNutritionRecipes = async () => {
        try {
            const res = await getRecipesWithoutNutrition(pageNoNutri, pageSizeNoNutri, keywordNoNutri);
            setRecipesNoNutri(res.recipes || []);
            setTotalNoNutri(res.totalRecords || 0);
        } catch (error) {
            console.error('Lỗi load món chưa dinh dưỡng:', error);
            setRecipesNoNutri([]);
            setTotalNoNutri(0);
        }
    };

    useEffect(() => {
        if (tabIndex === 0) loadAllRecipes();
        else loadNoNutritionRecipes();
    }, [tabIndex, pageAll, pageSizeAll, keywordAll, pageNoNutri, pageSizeNoNutri, keywordNoNutri]);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };
    const loadRecipeDetail = async (id) => {
        setLoadingDetail(true);
        setErrorDetail(null);
        try {
            const res = await getRecipeDetailForAdmin(id);
            setRecipeDetail(res);
        } catch (error) {
            setErrorDetail('Lỗi tải chi tiết món ăn');
        } finally {
            setLoadingDetail(false);
        }
    };
    const handleEditClick = async (recipeId) => {
        try {
            // setLoading(true);
            const detail = await getRecipeDetailForAdmin(recipeId);
            setRecipeDetail(detail);
            setEditOpen(true); // mở modal sau khi có data
        } catch (error) {
            console.error('Không thể tải chi tiết công thức:', error);
        } finally {
            // setLoading(false);
        }
    };
    useEffect(() => {
        if (selectedRecipeId !== null) {
            loadRecipeDetail(selectedRecipeId);
        }
    }, [selectedRecipeId]);


    // const handleOpenEdit = (recipe) => {
    //     setSelectedRecipe(recipe);
    //     setOpenEditModal(true);
    // };

    // const handleCloseEdit = () => {
    //     setOpenEditModal(false);
    //     setSelectedRecipe(null);
    // };

    // Hàm render table cho tab nào thì truyền data tương ứng
    const renderTableBody = (recipes, page, pageSize) => {
        if (recipes.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ height: 200, fontSize: '18px' }}>
                        Không có dữ liệu.
                    </TableCell>
                </TableRow>
            );
        }

        return recipes.map((r, index) => (
            <TableRow
                key={r.recipeID}
                sx={{ '&:hover': { backgroundColor: '#F3F9FF' }, transition: 'background-color 0.3s' }}
            >
                <TableCell sx={{ fontSize: '18px' }} align="center">{(page - 1) * pageSize + index + 1}</TableCell>
                <TableCell sx={{ fontSize: '18px' }}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <img
                            src={r.recipeIMG}
                            alt={r.title}
                            width={150}
                            height={150}
                            style={{ objectFit: 'cover', borderRadius: 4 }}
                        />
                        <Typography sx={{ fontSize: 20 }}>{r.title}</Typography>
                    </Box>
                </TableCell>
                <TableCell align="center">
                    <Tooltip title="Xem chi tiết">
                        <IconButton
                            color="primary"
                            onClick={() => {
                                setSelectedRecipeId(r.recipeID);
                                setOpen(true);
                            }}
                        >
                            <VisibilityIcon fontSize="large" />
                        </IconButton>

                    </Tooltip>

                    <Tooltip title="Sửa công thức">
                        <IconButton color="primary" onClick={() => handleEditClick(r.recipeID)}>
                            <EditOutlinedIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
            <Typography variant="h5" gutterBottom>
                Quản lý công thức món ăn
            </Typography>

            <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="Tất cả món" />
                <Tab label="Món chưa có dinh dưỡng" />
            </Tabs>

            {tabIndex === 0 && (
                <>
                    <Box mb={2} display="flex" justifyContent="space-between" gap={2} flexWrap="wrap">
                        <TextField
                            label="Tìm kiếm"
                            variant="outlined"
                            size="small"
                            value={keywordAll}
                            onChange={e => setKeywordAll(e.target.value)}
                            sx={{ minWidth: 300 }}
                        />
                        <Button variant="outlined" startIcon={<AddIcon />} color="success"
                            sx={{ fontSize: '20px' }}
                            onClick={() => setOpenAddModal(true)}>
                            Thêm món ăn
                        </Button>
                        <AddRecipeModal
                            open={openAddModal}
                            onClose={() => setOpenAddModal(false)}
                            onRecipeAdded={loadAllRecipes}
                        />
                    </Box>

                    <TableContainer sx={{ maxHeight: 700 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                                    <TableCell sx={{ fontSize: '20px', width: '5%', textAlign: 'center' }}>STT</TableCell>
                                    <TableCell sx={{ fontSize: '20px', width: '80%' }}>Tên món</TableCell>
                                    <TableCell sx={{ fontSize: '20px', width: '15%', textAlign: 'center' }}>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{renderTableBody(recipesAll, pageAll, pageSizeAll)}</TableBody>
                        </Table>
                    </TableContainer>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} flexWrap="wrap" gap={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography>Hiển thị:</Typography>
                            <FormControl size="small">
                                <TextField
                                    select
                                    value={pageSizeAll}
                                    onChange={e => setPageSizeAll(parseInt(e.target.value, 10))}
                                    size="small"
                                    sx={{ width: 80 }}
                                >
                                    {PAGE_SIZES.map(size => (
                                        <MenuItem key={size} value={size}>
                                            {size}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        </Box>

                        <Pagination
                            count={Math.ceil(totalAll / pageSizeAll)}
                            page={pageAll}
                            onChange={(e, value) => setPageAll(value)}
                            color="primary"
                            shape="rounded"
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                </>
            )}

            {tabIndex === 1 && (
                <>
                    <Box mb={2} display="flex" justifyContent="flex-start" gap={2} flexWrap="wrap">
                        <TextField
                            label="Tìm kiếm"
                            variant="outlined"
                            size="small"
                            value={keywordNoNutri}
                            onChange={e => setKeywordNoNutri(e.target.value)}
                            sx={{ minWidth: 300 }}
                        />
                    </Box>

                    <TableContainer sx={{ maxHeight: 700 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                                    <TableCell sx={{ fontSize: '20px', width: '5%', textAlign: 'center' }}>STT</TableCell>
                                    <TableCell sx={{ fontSize: '20px', width: '80%' }}>Tên món</TableCell>
                                    <TableCell sx={{ fontSize: '20px', width: '15%', textAlign: 'center' }}>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{renderTableBody(recipesNoNutri, pageNoNutri, pageSizeNoNutri)}</TableBody>
                        </Table>
                    </TableContainer>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} flexWrap="wrap" gap={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography>Hiển thị:</Typography>
                            <FormControl size="small">
                                <TextField
                                    select
                                    value={pageSizeNoNutri}
                                    onChange={e => setPageSizeNoNutri(parseInt(e.target.value, 10))}
                                    size="small"
                                    sx={{ width: 80 }}
                                >
                                    {PAGE_SIZES.map(size => (
                                        <MenuItem key={size} value={size}>
                                            {size}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        </Box>

                        <Pagination
                            count={Math.ceil(totalNoNutri / pageSizeNoNutri)}
                            page={pageNoNutri}
                            onChange={(e, value) => setPageNoNutri(value)}
                            color="primary"
                            shape="rounded"
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                </>
            )}
            <RecipeDetailModal
                open={open}
                onClose={() => {
                    setOpen(false);
                    setRecipeDetail(null);
                    setSelectedRecipeId(null);
                }}
                recipe={recipeDetail}
                loading={loadingDetail}
                error={errorDetail}
            />
            <EditRecipeModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                recipe={recipeDetail}
                onUpdate={loadAllRecipes}
            // allTags={allTags}
            />

        </Paper>
    );
};

export default RecipeAdminTabs;
