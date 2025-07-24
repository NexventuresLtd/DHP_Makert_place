import { useState, useEffect } from "react";
import {
    Star,
    ChevronLeft,
    Heart,
    Share2,
    ShoppingCart,
    Check,
    X,
    Image as ImageIcon,
    Loader2,
    AlertCircle,
    Coins,

} from "lucide-react";
import mainAxios from "../../Instance/mainAxios";
import { getUserInfo } from "../../../app/Localstorage";
import { addItemToCart } from "../../../app/addToCartUtil";


interface ProductImage {
    image: string;
}

interface Product {
    id: number;
    images: ProductImage[];
    name: string;
    slug: string;
    description: string;
    price: string;
    original_price: string;
    condition: "new" | "used" | "refurbished";
    stock: number;
    rating: string;
    review_count: number;
    created_at: string;
    updated_at: string;
    is_featured: boolean;
    is_active: boolean;
    seller: number;
    category: number;
}

interface Category {
    id: number;
    slug: string;
    name: string;
    description: string;
    image: string;
}

interface ProductDetailModalProps {
    product: Product;
    onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [category, setCategory] = useState<Category | null>(null);
    const [isLoadingCategory, setIsLoadingCategory] = useState(false);
    const [categoryError, setCategoryError] = useState<string | null>(null);

    // Fetch category information
    useEffect(() => {
        const fetchCategory = async () => {
            if (!product.category) return;

            setIsLoadingCategory(true);
            setCategoryError(null);
            try {
                const response = await mainAxios.get(`/market/categories/${product.category}/`);
                setCategory(response.data);
            } catch (err) {
                console.error("Failed to fetch category:", err);
                setCategoryError("Failed to load category information");
            } finally {
                setIsLoadingCategory(false);
            }
        };

        fetchCategory();
    }, [product.category]);

    // Format price
    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(parseFloat(price));
    };

    // Calculate discount percentage
    const discountPercentage = product.original_price
        ? Math.round(
            ((parseFloat(product.original_price) - parseFloat(product.price)) /
                parseFloat(product.original_price)) *
            100
        )
        : 0;

    // Handle quantity changes
    const handleQuantityChange = (value: number) => {
        const newValue = quantity + value;
        if (newValue > 0 && newValue <= product.stock) {
            setQuantity(newValue);
        }
    };

    // Condition badge
    const conditionBadge = () => {
        switch (product.condition) {
            case "new":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="w-3 h-3 mr-1" />
                        New
                    </span>
                );
            case "used":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Used
                    </span>
                );
            case "refurbished":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Refurbished
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
                    <div className="w-6"></div> {/* Spacer for alignment */}
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Product Images */}
                        <div>
                            <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 h-96">
                                {product.images.length > 0 ? (
                                    <img
                                        src={product.images[selectedImage].image}
                                        alt={product.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "logos/logo-circle.png";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="w-16 h-16 text-gray-400" />
                                    </div>
                                )}
                                {discountPercentage > 0 && (
                                    <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                                        {discountPercentage}% OFF
                                    </div>
                                )}
                            </div>

                            {product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {product.images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative h-20 rounded-md overflow-hidden border-2 ${selectedImage === index
                                                ? "border-primary"
                                                : "border-transparent"
                                                }`}
                                        >
                                            <img
                                                src={img.image}
                                                alt={`${product.name} thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "logos/logo-circle.png";
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        {product.name}
                                    </h1>
                                    <div className="flex items-center gap-2 mb-4">
                                        {conditionBadge()}
                                        {product.is_featured && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className={`p-2 rounded-full ${isWishlisted
                                            ? "text-red-500 bg-red-50"
                                            : "text-gray-500 hover:bg-gray-100"
                                            }`}
                                    >
                                        <Heart
                                            className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""
                                                }`}
                                        />
                                    </button>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowShareOptions(!showShareOptions)}
                                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
                                        >
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                        {showShareOptions && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Copy Link
                                                </button>
                                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Share on Facebook
                                                </button>
                                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Share on Twitter
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center mb-4">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-5 h-5 ${star <= Math.floor(parseFloat(product.rating))
                                                ? "text-yellow-400 fill-current"
                                                : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-600">
                                    {product.rating} ({product.review_count} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-center">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.original_price && (
                                        <span className="ml-3 text-lg text-gray-500 line-through">
                                            {formatPrice(product.original_price)}
                                        </span>
                                    )}
                                </div>
                                {discountPercentage > 0 && (
                                    <span className="text-sm text-green-600">
                                        You save {formatPrice(
                                            (
                                                parseFloat(product.original_price) - parseFloat(product.price)
                                            ).toString()
                                        )} ({discountPercentage}%)
                                    </span>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className="mb-6">
                                {product.stock > 0 ? (
                                    <div className="flex items-center text-green-600">
                                        <Check className="w-5 h-5 mr-2" />
                                        <span>
                                            In stock ({product.stock} available)
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center text-red-600">
                                        <X className="w-5 h-5 mr-2" />
                                        <span>Out of stock</span>
                                    </div>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity
                                </label>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        -
                                    </button>
                                    <div className="px-4 py-2 border-t border-b border-gray-300 bg-white text-center w-12">
                                        {quantity}
                                    </div>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= product.stock}
                                        className="px-3 py-2 border border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            {/** check if admin hide this */}
                            {getUserInfo.type !== "admin" && (<>
                                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                                    <button
                                        onClick={async () => {
                                            // Add to cart logic here
                                            console.log(`Added ${quantity} of ${product.name} to cart`);
                                            if((await addItemToCart(product.id, quantity)).status) {
                                                alert(`${quantity} ${product.name} added to cart`);
                                            }else{
                                                alert(`Failed to add ${quantity} ${product.name} to cart`);
                                            }
                                        }}
                                        disabled={product.stock <= 0}
                                        className={`flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${product.stock > 0
                                            ? "bg-primary hover:bg-primary/90"
                                            : "bg-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => {
                                            window.open('https://wa.me/0788282962', '_blank');
                                        }}

                                        disabled={product.stock <= 0}
                                        className={`flex-1 flex items-center justify-center px-6 py-3 border border-primary rounded-md shadow-sm text-base font-medium ${product.stock > 0
                                            ? "text-primary bg-white hover:bg-gray-50"
                                            : "text-gray-400 border-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        <Coins className="w-5 h-5 mr-2" />
                                        Buy
                                    </button>
                                </div>
                            </>)}
                            {/* Product Details */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Product Details
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Condition</p>
                                            <p className="text-sm font-medium text-gray-900 capitalize">
                                                {product.condition}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Category</p>
                                            {isLoadingCategory ? (
                                                <div className="flex items-center">
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    <span className="text-sm">Loading...</span>
                                                </div>
                                            ) : categoryError ? (
                                                <div className="flex items-center text-red-500">
                                                    <AlertCircle className="w-4 h-4 mr-1" />
                                                    <span className="text-sm">{categoryError}</span>
                                                </div>
                                            ) : category ? (
                                                <div className="flex items-center">
                                                    <img
                                                        src={category.image}
                                                        alt={category.name}
                                                        className="w-6 h-6 rounded-full object-cover mr-2"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = "logos/logo-circle.png";
                                                        }}
                                                    />
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {category.name}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-sm font-medium text-gray-900">
                                                    Uncategorized
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Description</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">
                                            {product.description || "No description available"}
                                        </p>
                                    </div>
                                    {category && (
                                        <div>
                                            <p className="text-sm text-gray-500">Category Description</p>
                                            <p className="text-sm font-medium text-gray-900 mt-1">
                                                {category.description || "No category description available"}
                                            </p>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Added on</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {new Date(product.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Last updated</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {new Date(product.updated_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}