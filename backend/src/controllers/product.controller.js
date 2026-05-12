import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const mockProducts = [
    // MEN (7 Products)
    { 
        _id: 'm1', name: 'Premium Cotton Tee', price: 45, images: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800'], 
        description: 'Crafted from 100% long-staple organic cotton, this premium tee offers an exceptionally soft hand-feel and superior durability. Features a classic crew neck, reinforced shoulder seams, and a tailored fit that retains its shape wash after wash. The perfect foundation for any modern wardrobe, providing effortless comfort and a clean, minimalist aesthetic.', 
        category: { _id: '1', name: 'Men' }, stock: 50, isFeatured: true, ratings: 4.8, numReviews: 2,
        reviews: [{ name: "John Doe", rating: 5, comment: "Absolutely love the quality!" }, { name: "Sarah Smith", rating: 4, comment: "Very comfortable." }]
    },
    { 
        _id: 'm3', name: 'Classic Denim Jeans', price: 85, images: ['https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=800'], 
        description: 'Our signature classic denim jeans are engineered for both style and longevity. Made from premium 13oz selvedge denim with a hint of stretch for mobility. These jeans feature a timeless straight-leg cut, traditional five-pocket styling, and custom metal hardware. The deep indigo wash will age beautifully over time.', 
        category: { _id: '1', name: 'Men' }, stock: 30, isFeatured: true, ratings: 4.8, numReviews: 1,
        reviews: [{ name: "Mike Ross", rating: 5, comment: "Perfect fit." }]
    },
    { 
        _id: 'm5', name: 'Grey Zip Hoodie', price: 55, images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'], 
        description: 'The ultimate lounge essential, our Grey Zip Hoodie is constructed from a heavyweight, ultra-soft premium cotton-fleece blend. Designed with a modern, relaxed silhouette, it features a brushed interior for maximum warmth and a sturdy YKK metal zipper. Perfect for layering during chilly mornings.', 
        category: { _id: '1', name: 'Men' }, stock: 45, isFeatured: false, ratings: 4.2, numReviews: 1,
        reviews: [{ name: "Alex G.", rating: 4, comment: "Very soft." }]
    },
    { 
        _id: 'm6', name: 'Linen Button-Down', price: 50, images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800'], 
        description: 'Embrace effortless summer style with our breathable Linen Button-Down. Sourced from the finest Belgian flax, this shirt offers a cool, crisp texture that naturally wicks moisture. The relaxed fit and garment-dyed finish give it a sophisticated yet laid-back look for the beach.', 
        category: { _id: '1', name: 'Men' }, stock: 25, isFeatured: true, ratings: 4.5, numReviews: 2, 
        reviews: [
            { name: "John Doe", rating: 5, comment: "Perfect for summer!" },
            { name: "David K.", rating: 4, comment: "Nice material, fits well." }
        ]
    },
    { 
        _id: 'm7', name: 'Olive Cargo Pants', price: 70, images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800'], 
        description: 'Rugged functionality meets modern street style. These Olive Cargo Pants are made from high-density ripstop cotton for maximum durability. Featuring multi-functional cargo pockets with secure snap closures and a tapered fit for a contemporary silhouette that transitions from urban exploration to rugged trails.', 
        category: { _id: '2', name: 'Women' }, stock: 35, isFeatured: false, ratings: 4.3, numReviews: 1, 
        reviews: [{ name: "Alex B.", rating: 4.3, comment: "Tough and stylish." }]
    },
    { 
        _id: 'm9', name: 'Tan Trench Coat', price: 150, images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800'], 
        description: 'An icon of elegance, our Tan Trench Coat provides sophisticated protection from the elements. Crafted from a water-repellent cotton gabardine, it features a traditional double-breasted front, epaulettes, and a belted waist. This timeless piece adds a layer of sharp professionalism to any ensemble.', 
        category: { _id: '1', name: 'Men' }, stock: 15, isFeatured: true, ratings: 4.9, numReviews: 1, 
        reviews: [{ name: "Chris L.", rating: 5, comment: "Pure class. Worth every penny." }]
    },
    { 
        _id: 'm10', name: 'Grey Wool Sweater', price: 75, images: ['https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&q=80&w=800'], 
        description: 'Experience unmatched warmth with our ethically sourced Grey Wool Sweater. This medium-weight knit features a sophisticated ribbed texture and a comfortable crew neck. The premium wool fibers provide natural insulation while remaining breathable and soft against the skin for all-day comfort.', 
        category: { _id: '1', name: 'Men' }, stock: 20, isFeatured: false, ratings: 4.5, numReviews: 1, 
        reviews: [{ name: "Mark P.", rating: 4.5, comment: "Very warm and cozy." }]
    },

    // WOMEN (6 Products)
    { 
        _id: 'w1', name: 'Silk Slip Dress', price: 95, images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800'], 
        description: 'Defined by its minimalist silhouette, our Silk Slip Dress is cut from luxurious heavy-weight mulberry silk with a beautiful luster. It features delicate adjustable spaghetti straps and a bias cut that drapes elegantly over the body for a flawless fit. Ideal for evening events or chic layering.', 
        category: { _id: '2', name: 'Women' }, stock: 25, isFeatured: true, ratings: 4.7, numReviews: 2, 
        reviews: [
            { name: "Sophia R.", rating: 5, comment: "Elegant and fits like a dream." },
            { name: "Emma W.", rating: 4, comment: "Beautiful silk, very luxurious." }
        ]
    },
    { 
        _id: 'w2', name: 'High-Rise Denim', price: 75, images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800'], 
        description: 'The perfect vintage-inspired fit, our High-Rise Denim is engineered to flatter. Made from high-quality rigid denim that breaks in over time, these jeans feature a classic straight leg and a high waist. They provide a structured look that pairs perfectly with tucked-in tees or oversized knits.', 
        category: { _id: '2', name: 'Women' }, stock: 40, isFeatured: true, ratings: 4.4, numReviews: 1, 
        reviews: [{ name: "Jessica T.", rating: 4, comment: "Great fit, high quality denim." }]
    },
    { 
        _id: 'w3', name: 'Floral Maxi Dress', price: 110, images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800'], 
        description: 'Capture bohemian romance with our Floral Maxi Dress. Crafted from a lightweight, flowing georgette fabric, it features an intricate hand-drawn floral print, a cinched waist, and a tiered skirt. The perfect statement piece for garden parties or sun-drenched summer getaways.', 
        category: { _id: '2', name: 'Women' }, stock: 20, isFeatured: false, ratings: 4.6, numReviews: 1, 
        reviews: [{ name: "Lily M.", rating: 5, comment: "Beautiful print!" }]
    },
    { 
        _id: 'w6', name: 'Leather Biker Jacket', price: 180, images: ['https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&q=80&w=800'], 
        description: 'Edgy style for the bold. Our Leather Biker Jacket is handcrafted from premium full-grain lambskin that is buttery soft yet durable. Featuring classic asymmetrical zippers, snap-down lapels, and a tailored fit. This investment piece only gets better and more unique with age.', 
        category: { _id: '1', name: 'Men' }, stock: 10, isFeatured: true, ratings: 4.8, numReviews: 1, 
        reviews: [{ name: "Nina K.", rating: 5, comment: "Absolute masterpiece." }]
    },
    { 
        _id: 'w8', name: 'Graphic Oversized Tee', price: 38, images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800'], 
        description: 'A staple of modern street style, our Graphic Oversized Tee is made from a heavy-weight cotton jersey. Featuring a dropped shoulder and a relaxed, boxy fit, it provides ultimate comfort while making a bold fashion statement. The hand-screened graphic adds an artistic edge.', 
        category: { _id: '2', name: 'Women' }, stock: 60, isFeatured: false, ratings: 4.1, numReviews: 1, 
        reviews: [{ name: "Zoe B.", rating: 4, comment: "Love the oversized look." }]
    },
    { 
        _id: 'w9', name: 'Velvet Evening Gown', price: 240, images: ['/images/velvet_evening_gown_elite.png'], 
        description: 'Exude luxury in our Velvet Evening Gown. This floor-length masterpiece is crafted from ultra-plush emerald velvet with a subtle stretch for a contouring fit. Featuring a sophisticated high neckline and an elegant side slit, it is the ultimate choice for black-tie galas and red-carpet moments.', 
        category: { _id: '2', name: 'Women' }, stock: 12, isFeatured: true, ratings: 5.0, numReviews: 1, 
        reviews: [{ name: "Isabella G.", rating: 5, comment: "Stunning gown." }]
    },

    // ACCESSORIES (7 Products)
    { 
        _id: 'a1', name: 'Classic Leather Watch', price: 190, images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800'], 
        description: 'A masterpiece of minimalist horology, this classic timepiece features a precision Swiss movement housed in a brushed 316L stainless steel case. The dial is protected by sapphire crystal and paired with a genuine Italian leather strap that develops a unique patina over time.', 
        category: { _id: '3', name: 'Accessories' }, stock: 15, isFeatured: true, ratings: 4.9, numReviews: 1,
        reviews: [{ name: "John Doe", rating: 5, comment: "Excellent watch!" }]
    },
    { 
        _id: 'a2', name: 'Leather Tote Bag', price: 145, images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'], 
        description: 'Exquisitely handcrafted from buttery-soft pebbled leather, this spacious tote is the perfect companion for the modern professional. The interior features a luxurious microfiber lining, a secure zippered pocket for valuables, and two slip pockets for easy organization of your daily essentials.', 
        category: { _id: '3', name: 'Accessories' }, stock: 20, isFeatured: true, ratings: 4.7, numReviews: 1, 
        reviews: [{ name: "Sarah J.", rating: 5, comment: "Beautiful bag, very spacious." }]
    },
    { 
        _id: 'a4', name: 'Silk Scarf', price: 45, images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=800'], 
        description: 'Add a touch of timeless elegance with our Hand-Woven Silk Scarf. Featuring an intricate geometric pattern and finished with hand-rolled edges, this versatile accessory can be styled in multiple ways. The lightweight, lustrous silk adds a pop of color and sophistication to any look.', 
        category: { _id: '3', name: 'Accessories' }, stock: 30, isFeatured: false, ratings: 4.5, numReviews: 1, 
        reviews: [{ name: "Linda H.", rating: 4, comment: "Very soft and elegant." }]
    },
    { 
        _id: 'a5', name: 'Canvas Backpack', price: 65, images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'], 
        description: 'Reliable for every journey, our Canvas Backpack combines rugged durability with smart organization. Constructed from heavy-duty water-resistant canvas with genuine leather accents. It features a padded laptop sleeve, multiple exterior pockets, and ergonomic straps for all-day comfort.', 
        category: { _id: '3', name: 'Accessories' }, stock: 35, isFeatured: true, ratings: 4.4, numReviews: 1, 
        reviews: [{ name: "Tom S.", rating: 4, comment: "Sturdy and looks great." }]
    },
    { 
        _id: 'a6', name: 'Silver Hoop Earrings', price: 35, images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'], 
        description: 'A minimalist essential, our Silver Hoop Earrings are crafted from high-polish sterling silver. Their lightweight design makes them comfortable for all-day wear, while their timeless silhouette adds a subtle touch of shine to both casual and formal outfits.', 
        category: { _id: '3', name: 'Accessories' }, stock: 50, isFeatured: false, ratings: 4.2, numReviews: 1, 
        reviews: [{ name: "Grace L.", rating: 4, comment: "Simple and elegant." }]
    },
    { 
        _id: 'a9', name: 'Minimalist Wallet', price: 40, images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800'], 
        description: 'Engineered for the modern man, our Minimalist Wallet features a slim profile that eliminates pocket bulk. Hand-stitched from premium top-grain leather, it includes four card slots and a central compartment for cash. A perfect blend of traditional craft and modern utility.', 
        category: { _id: '3', name: 'Accessories' }, stock: 50, isFeatured: true, ratings: 4.6, numReviews: 1, 
        reviews: [{ name: "James B.", rating: 5, comment: "Great slim wallet." }]
    },
    { 
        _id: 'a10', name: 'Gold Pendant Necklace', price: 120, images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'], 
        description: 'Make a personal statement with our 18K Gold Plated Pendant Necklace. Featuring a minimalist circular charm on a delicate cable chain, this piece is designed for effortless layering. The high-polish finish ensures a lasting radiance that elevates any neckline.', 
        category: { _id: '3', name: 'Accessories' }, stock: 20, isFeatured: true, ratings: 4.8, numReviews: 1, 
        reviews: [{ name: "Olivia P.", rating: 5, comment: "Absolutely beautiful." }]
    },

    // FOOTWEAR (5 Products)
    { 
        _id: 'f2', name: 'Chelsea Boots', price: 135, images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800'], 
        description: 'Sleek and versatile, our Chelsea Boots are handcrafted from premium European calfskin leather. Featuring traditional elastic side gussets and a sturdy pull tab, they offer a comfortable slip-on fit. The durable Goodyear-welted sole ensures these boots will last for years to come.', 
        category: { _id: '4', name: 'Footwear' }, stock: 20, isFeatured: true, ratings: 4.7, numReviews: 1, 
        reviews: [{ name: "Harry T.", rating: 5, comment: "Best boots I've owned." }]
    },
    { 
        _id: 'f4', name: 'Runners Pro', price: 120, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'], 
        description: 'Engineered for high performance, the Runners Pro features a breathable mesh upper and a responsive carbon-fiber plate for maximum energy return. The advanced cushioning system provides superior impact protection, making them the ultimate choice for serious athletes and marathon runners.', 
        category: { _id: '4', name: 'Footwear' }, stock: 25, isFeatured: true, ratings: 4.8, numReviews: 1, 
        reviews: [{ name: "Will S.", rating: 5, comment: "Great for long runs." }]
    },
    { 
        _id: 'f5', name: 'Classic Loafers', price: 95, images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=800'], 
        description: 'A masterpiece of smart-casual footwear, our Classic Loafers are made from supple suede with a traditional moccasin construction. Featuring a comfortable padded insole and a flexible rubber sole, they provide a sophisticated look that doesn\'t compromise on all-day comfort.', 
        category: { _id: '4', name: 'Footwear' }, stock: 30, isFeatured: false, ratings: 4.4, numReviews: 1, 
        reviews: [{ name: "Ben J.", rating: 4, comment: "Very comfortable and stylish." }]
    },
    { 
        _id: 'f8', name: 'Derby Shoes', price: 110, images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800'], 
        description: 'Elegant and professional, our Derby Shoes are handcrafted from full-grain polished leather. With their classic open-lacing system and sleek silhouette, they are the perfect choice for formal occasions or elevating your daily office attire. Built for both style and stability.', 
        category: { _id: '4', name: 'Footwear' }, stock: 20, isFeatured: false, ratings: 4.6, numReviews: 2,
        reviews: [{ name: "Robert H.", rating: 5, comment: "Best dress shoes!" }, { name: "James L.", rating: 4, comment: "Excellent leather." }]
    },
    { 
        _id: 'f9', name: 'Basketball High-Tops', price: 130, images: ['https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&q=80&w=800'], 
        description: 'Ready for the court or the street, our Basketball High-Tops combine heritage design with modern comfort. Featuring a supportive padded collar, a multi-directional traction pattern for grip, and a vibrant color-blocked aesthetic that demands attention.', 
        category: { _id: '4', name: 'Footwear' }, stock: 25, isFeatured: true, ratings: 4.7, numReviews: 1, 
        reviews: [{ name: "Jordan M.", rating: 5, comment: "Incredible traction." }]
    }
];

const getAllProducts = asyncHandler(async (req, res) => {
    if (process.env.USE_MOCK_DB === 'true') {
        const { category, search, sort, minPrice, maxPrice, size } = req.query;
        let products = [...mockProducts].map(p => ({
            ...p,
            sizes: p.sizes || ['S', 'M', 'L', 'XL']
        }));

        if (category) {
            products = products.filter(p => p.category._id === category || p.category.name.toLowerCase() === category.toLowerCase());
        }

        if (search) {
            const searchTerm = search.toLowerCase();
            products = products.filter(p => 
                p.name.toLowerCase().includes(searchTerm)
            );
        }

        if (minPrice) {
            products = products.filter(p => p.price >= Number(minPrice));
        }

        if (maxPrice) {
            products = products.filter(p => p.price <= Number(maxPrice));
        }

        if (size) {
            const sizesArr = size.split(',');
            products = products.filter(p => p.sizes && p.sizes.some(s => sizesArr.includes(s)));
        }

        if (sort) {
            const [field, order] = sort.split(":");
            products.sort((a, b) => {
                const valA = a[field] || 0;
                const valB = b[field] || 0;
                if (order === 'desc') return valB > valA ? 1 : -1;
                return valA > valB ? 1 : -1;
            });
        }

        return res.status(200).json(new ApiResponse(200, { products, total: products.length, page: 1, pages: 1 }, "Mock products fetched"));
    }
    const { page = 1, limit = 10, search, category, minPrice, maxPrice, sort, size } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (size) {
        query.sizes = { $in: size.split(',') };
    }

    const sortObj = {};
    if (sort) {
        const [field, order] = sort.split(":");
        sortObj[field] = order === "desc" ? -1 : 1;
    } else {
        sortObj.createdAt = -1;
    }

    const products = await Product.find(query)
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("category", "name");

    const total = await Product.countDocuments(query);

    res.status(200).json(
        new ApiResponse(200, {
            products,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit)
        }, "Products fetched successfully")
    );
});

const getProductById = asyncHandler(async (req, res) => {
    if (process.env.USE_MOCK_DB === 'true') {
        const product = mockProducts.find(p => p._id === req.params.id);
        if (!product) throw new ApiError(404, "Product not found");
        return res.status(200).json(new ApiResponse(200, product, "Mock product fetched"));
    }
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, stock } = req.body;

    if ([name, description, price, category, stock].some((field) => field?.toString().trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const imagesLocalPaths = req.files?.images;
    if (!imagesLocalPaths || imagesLocalPaths.length === 0) {
        throw new ApiError(400, "At least one product image is required");
    }

    const images = await Promise.all(
        imagesLocalPaths.map(async (file) => {
            const uploaded = await uploadOnCloudinary(file.path);
            return uploaded.url;
        })
    );

    const product = await Product.create({
        name,
        description,
        price,
        category,
        stock,
        images
    });

    res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"));
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
    if (process.env.USE_MOCK_DB === 'true') {
        const featured = mockProducts.filter(p => p.isFeatured);
        return res.status(200).json(new ApiResponse(200, featured, "Mock featured products fetched"));
    }
    const products = await Product.find({ isFeatured: true }).populate("category", "name");
    res.status(200).json(new ApiResponse(200, products, "Featured products fetched successfully"));
});

const getProductsByCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    if (process.env.USE_MOCK_DB === 'true') {
        const products = mockProducts.filter(p => p.category._id === categoryId);
        return res.status(200).json(new ApiResponse(200, products, "Mock products by category fetched"));
    }
    const products = await Product.find({ category: categoryId }).populate("category", "name");
    res.status(200).json(new ApiResponse(200, products, "Products by category fetched successfully"));
});

const getRelatedProducts = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (process.env.USE_MOCK_DB === 'true') {
        const product = mockProducts.find(p => p._id === id);
        const related = mockProducts.filter(p => p.category._id === product?.category._id && p._id !== id);
        return res.status(200).json(new ApiResponse(200, related.slice(0, 4), "Mock related products fetched"));
    }
    const product = await Product.findById(id);
    const related = await Product.find({
        category: product.category,
        _id: { $ne: id }
    }).limit(4).populate("category", "name");
    res.status(200).json(new ApiResponse(200, related, "Related products fetched successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) throw new ApiError(404, "Product not found");
    res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});

const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const { id } = req.params;

    if (process.env.USE_MOCK_DB === 'true') {
        const product = mockProducts.find(p => p._id === id);
        if (!product) throw new ApiError(404, "Product not found");
        
        const review = {
            name: req.user.fullName,
            rating: Number(rating),
            comment,
            createdAt: new Date().toISOString()
        };
        
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
        
        return res.status(201).json(new ApiResponse(201, review, "Mock review added"));
    }

    const product = await Product.findById(id);
    if (!product) throw new ApiError(404, "Product not found");

    const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) throw new ApiError(400, "Product already reviewed");

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
    res.status(201).json(new ApiResponse(201, review, "Review added successfully"));
});

export {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getProductsByCategory,
    getRelatedProducts,
    createProductReview
};
