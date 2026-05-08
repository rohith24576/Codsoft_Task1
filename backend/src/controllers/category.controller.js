import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Category } from "../models/category.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllCategories = asyncHandler(async (req, res) => {
    if (process.env.USE_MOCK_DB === 'true') {
        const mockCategories = [
            { _id: '1', name: 'Men', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&q=80&w=800' },
            { _id: '2', name: 'Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800' },
            { _id: '3', name: 'Accessories', image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800' },
            { _id: '4', name: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' }
        ];
        return res.status(200).json(new ApiResponse(200, mockCategories, "Mock categories fetched"));
    }
    const categories = await Category.find();
    return res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

const createCategory = asyncHandler(async (req, res) => {
    const { name, image } = req.body;
    if (!name) throw new ApiError(400, "Name is required");

    const category = await Category.create({ name, image });
    return res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
});

const updateCategory = asyncHandler(async (req, res) => {
    const { name, image } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, { name, image }, { new: true });
    if (!category) throw new ApiError(404, "Category not found");
    return res.status(200).json(new ApiResponse(200, category, "Category updated successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw new ApiError(404, "Category not found");
    return res.status(200).json(new ApiResponse(200, {}, "Category deleted successfully"));
});

export {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
};
