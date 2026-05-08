import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllProducts = asyncHandler(async (req, res) => {
    if (process.env.USE_MOCK_DB === 'true') {
        const { category, search } = req.query;
        let mockProducts = [
            // MEN (Category ID: 1)
            { _id: 'm1', name: 'Premium Cotton Tee', price: 45, images: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800'], description: 'A high-quality, breathable cotton t-shirt for everyday comfort.', category: { _id: '1', name: 'Men' }, stock: 50, isFeatured: true },
            { _id: 'm3', name: 'Classic Denim Jeans', price: 85, images: ['https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=800'], description: 'Timeless denim jeans with a comfortable fit.', category: { _id: '1', name: 'Men' }, stock: 30, isFeatured: true },
            { _id: 'm5', name: 'Grey Zip Hoodie', price: 55, images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'], description: 'Soft premium cotton blend for comfort.', category: { _id: '1', name: 'Men' }, stock: 45, isFeatured: false },
            { _id: 'm6', name: 'Linen Button-Down', price: 50, images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800'], description: 'Breathable linen for summer days.', category: { _id: '1', name: 'Men' }, stock: 25, isFeatured: true },
            { _id: 'm7', name: 'Olive Cargo Pants', price: 70, images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800'], description: 'Rugged style with plenty of pockets.', category: { _id: '1', name: 'Men' }, stock: 35, isFeatured: false },
            { _id: 'm9', name: 'Tan Trench Coat', price: 150, images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800'], description: 'Elegant protection from the elements.', category: { _id: '1', name: 'Men' }, stock: 15, isFeatured: true },
            { _id: 'm10', name: 'Grey Wool Sweater', price: 75, images: ['https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&q=80&w=800'], description: 'Warm wool for chilly evenings.', category: { _id: '1', name: 'Men' }, stock: 20, isFeatured: false },

            // WOMEN (Category ID: 2)
            { _id: 'w1', name: 'Silk Slip Dress', price: 95, images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800'], description: 'Minimalist silk dress.', category: { _id: '2', name: 'Women' }, stock: 25, isFeatured: true },
            { _id: 'w2', name: 'High-Rise Denim', price: 75, images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800'], description: 'The perfect vintage fit.', category: { _id: '2', name: 'Women' }, stock: 40, isFeatured: true },
            { _id: 'w3', name: 'Floral Maxi Dress', price: 110, images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800'], description: 'Bohemian style for sunny days.', category: { _id: '2', name: 'Women' }, stock: 20, isFeatured: false },
            { _id: 'w6', name: 'Leather Biker Jacket', price: 180, images: ['https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&q=80&w=800'], description: 'Edgy style for the bold.', category: { _id: '2', name: 'Women' }, stock: 10, isFeatured: true },
            { _id: 'w8', name: 'Graphic Oversized Tee', price: 38, images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800'], description: 'Casual street style.', category: { _id: '2', name: 'Women' }, stock: 60, isFeatured: false },

            // ACCESSORIES (Category ID: 3)
            { _id: 'a1', name: 'Classic Leather Watch', price: 190, images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800'], description: 'Timeless design with a genuine leather strap.', category: { _id: '3', name: 'Accessories' }, stock: 15, isFeatured: true },

            { _id: 'a2', name: 'Leather Tote Bag', price: 145, images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'], description: 'Spacious and stylish.', category: { _id: '3', name: 'Accessories' }, stock: 20, isFeatured: true },
            { _id: 'a4', name: 'Silk Scarf', price: 45, images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=800'], description: 'A touch of elegance.', category: { _id: '3', name: 'Accessories' }, stock: 30, isFeatured: false },
            { _id: 'a5', name: 'Canvas Backpack', price: 65, images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'], description: 'Reliable for every journey.', category: { _id: '3', name: 'Accessories' }, stock: 35, isFeatured: true },
            { _id: 'a6', name: 'Silver Hoop Earrings', price: 35, images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'], description: 'Minimalist shine.', category: { _id: '3', name: 'Accessories' }, stock: 50, isFeatured: false },
            { _id: 'a9', name: 'Minimalist Wallet', price: 40, images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800'], description: 'Slim design for the modern man.', category: { _id: '3', name: 'Accessories' }, stock: 50, isFeatured: true },

            // FOOTWEAR (Category ID: 4)
            { _id: 'f1', name: 'Urban Sneakers', price: 85, images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800'], description: 'Daily city explorer shoes.', category: { _id: '4', name: 'Footwear' }, stock: 30, isFeatured: true },
            { _id: 'f2', name: 'Chelsea Boots', price: 135, images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800'], description: 'Sleek leather boots.', category: { _id: '4', name: 'Footwear' }, stock: 20, isFeatured: true },
            { _id: 'f3', name: 'Canvas Slip-Ons', price: 45, images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800'], description: 'Easy and casual.', category: { _id: '4', name: 'Footwear' }, stock: 50, isFeatured: false },
            { _id: 'f4', name: 'Runners Pro', price: 120, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'], description: 'High-performance running shoes.', category: { _id: '4', name: 'Footwear' }, stock: 25, isFeatured: true },
            { _id: 'f5', name: 'Classic Loafers', price: 95, images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=800'], description: 'Smart and comfortable.', category: { _id: '4', name: 'Footwear' }, stock: 30, isFeatured: false },
            { _id: 'f8', name: 'Derby Shoes', price: 110, images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800'], description: 'Elegant leather dress shoes.', category: { _id: '4', name: 'Footwear' }, stock: 20, isFeatured: false },
            { _id: 'f9', name: 'Basketball High-Tops', price: 130, images: ['https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&q=80&w=800'], description: 'Court-ready style.', category: { _id: '4', name: 'Footwear' }, stock: 25, isFeatured: true },
            { _id: 'f10', name: 'Espadrilles', price: 50, images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800'], description: 'Casual summer classic.', category: { _id: '4', name: 'Footwear' }, stock: 45, isFeatured: false }
        ];

        if (category) {
            mockProducts = mockProducts.filter(p => p.category._id === category || p.category.name.toLowerCase() === category.toLowerCase());
        }

        if (search) {
            const searchTerm = search.toLowerCase();
            mockProducts = mockProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm) || 
                p.description.toLowerCase().includes(searchTerm)
            );
        }

        return res.status(200).json(new ApiResponse(200, { products: mockProducts, total: mockProducts.length, page: 1, pages: 1 }, "Mock products fetched"));
    }
    const { page = 1, limit = 10, search, category, minPrice, maxPrice, sort } = req.query;

    const query = {};

    if (search) {
        query.name = { $regex: search, $options: "i" };
    }

    if (category) {
        query.category = category;
    }

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortOptions = {};
    if (sort) {
        const [field, order] = sort.split(":");
        sortOptions[field] = order === "desc" ? -1 : 1;
    } else {
        sortOptions.createdAt = -1;
    }

    const products = await Product.find(query)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("category");

    const total = await Product.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, { products, total, page: Number(page), pages: Math.ceil(total / limit) }, "Products fetched successfully")
    );
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, discountPrice, category, stock, isFeatured } = req.body;

    if ([name, description, category].some(field => field?.trim() === "")) {
        throw new ApiError(400, "Name, description and category are required");
    }

    const imageLocalPaths = req.files;
    if (!imageLocalPaths || imageLocalPaths.length === 0) {
        throw new ApiError(400, "At least one image is required");
    }

    const imageUrls = [];
    for (const file of imageLocalPaths) {
        const result = await uploadOnCloudinary(file.path);
        if (result) imageUrls.push(result.url);
    }

    const product = await Product.create({
        name,
        description,
        price,
        discountPrice,
        category,
        stock,
        isFeatured,
        images: imageUrls
    });

    return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
    const { name, description, price, discountPrice, category, stock, isFeatured } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const updateData = {
        name: name || product.name,
        description: description || product.description,
        price: price || product.price,
        discountPrice: discountPrice || product.discountPrice,
        category: category || product.category,
        stock: stock || product.stock,
        isFeatured: isFeatured !== undefined ? isFeatured : product.isFeatured
    };

    if (req.files && req.files.length > 0) {
        const imageUrls = [];
        for (const file of req.files) {
            const result = await uploadOnCloudinary(file.path);
            if (result) imageUrls.push(result.url);
        }
        updateData.images = imageUrls;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });

    return res.status(200).json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    await product.deleteOne();
    return res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"));
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
    if (process.env.USE_MOCK_DB === 'true') {
        const mockProducts = [
            { _id: '1', name: 'Premium Cotton Tee', price: 45, images: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800'], description: 'A high-quality, breathable cotton t-shirt for everyday comfort.', category: { name: 'Men' }, stock: 50, isFeatured: true },
            { _id: '2', name: 'Minimalist Silk Dress', price: 120, images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800'], description: 'Elegant silk dress with a modern silhouette.', category: { name: 'Women' }, stock: 25, isFeatured: true },
            { _id: '3', name: 'Urban Sneakers', price: 85, images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800'], description: 'Lightweight sneakers designed for the city explorer.', category: { name: 'Footwear' }, stock: 30, isFeatured: true },
            { _id: '4', name: 'Classic Leather Watch', price: 190, images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800'], description: 'Timeless design with a genuine leather strap.', category: { name: 'Accessories' }, stock: 15, isFeatured: true }
        ];
        return res.status(200).json(new ApiResponse(200, mockProducts, "Mock featured products fetched"));
    }
    const products = await Product.find({ isFeatured: true }).limit(8).populate("category");
    return res.status(200).json(new ApiResponse(200, products, "Featured products fetched successfully"));
});

const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
        throw new ApiError(400, "Product already reviewed");
    }

    const review = {
        name: req.user.fullName,
        rating: Number(rating),
        comment,
        user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    return res.status(201).json(new ApiResponse(201, {}, "Review added"));
});

const getRelatedProducts = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const relatedProducts = await Product.find({
        category: product.category,
        _id: { $ne: product._id }
    }).limit(4).populate("category");

    return res.status(200).json(new ApiResponse(200, relatedProducts, "Related products fetched successfully"));
});

const getProductsByCategory = asyncHandler(async (req, res) => {
    const products = await Product.find({ category: req.params.categoryId }).populate("category");
    return res.status(200).json(new ApiResponse(200, products, "Products fetched by category"));
});

export {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    createProductReview,
    getRelatedProducts,
    getProductsByCategory
};
