import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Star, ArrowRight, CreditCard, MessageCircle, Package, TrendingUp, ShoppingBag, BarChart3, X, Loader2, ArrowLeft } from 'lucide-react';
import mainAxios from '../../comps/Instance/mainAxios';
import type { Cart, Category, Product, ProductImage } from '../../types/marketTypes';





const ShoppingCartViewer: React.FC = () => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
    const [category, setCategory] = useState<Category | null>(null);
    const [isLoadingCategory, setIsLoadingCategory] = useState(false);
    const [categoryError, setCategoryError] = useState<string | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await mainAxios.get('/market/cart/my_cart/');
            setCart(response.data);
        } catch (err) {
            setError('Failed to load your cart. Please try again.');
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategory = async (categoryId: number) => {
        if (!categoryId) return;

        setIsLoadingCategory(true);
        setCategoryError(null);
        try {
            const response = await mainAxios.get(`/market/categories/${categoryId}/`);
            setCategory(response.data);
        } catch (err) {
            console.error("Failed to fetch category:", err);
            setCategoryError("Failed to load category information");
        } finally {
            setIsLoadingCategory(false);
        }
    };

    const deleteCartItem = async (itemId: number) => {
        try {
            setDeleteLoading(itemId);
            await mainAxios.delete(`/market/cart/${itemId}/`);
            await fetchCart();
            setShowDeleteConfirm(null);
        } catch (err) {
            setError('Failed to remove item. Please try again.');
            console.error('Error deleting cart item:', err);
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleWhatsAppPayment = () => {
        if (!cart) return;

        setPaymentLoading(true);

        const itemsList = cart.items.map(item =>
            `• ${item.product.name} (Qty: ${item.quantity}) - ${formatPrice(parseFloat(item.product.price) * item.quantity)}`
        ).join('\n');

        const message = `Hello! I want to complete my order:\n\nOrder Details:\n${itemsList}\n\nTotal: ${formatPrice(cart.total_price)}\n\nPlease help me complete this payment.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/0788282962?text=${encodedMessage}`;

        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            setPaymentLoading(false);
            setShowPaymentModal(false);
        }, 1000);
    };

    const formatPrice = (price: string | number) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('rw-RW', {
            style: 'currency',
            currency: 'RWF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numPrice);
    };

    const getPrimaryImage = (images: ProductImage[]) => {
        if (!images || images.length === 0) {
            return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format';
        }

        const primaryImage = images.find(img => img.is_primary) || images[0];
        return primaryImage?.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format';
    };

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        if (selectedProduct) {
            fetchCategory(selectedProduct.category);
        }
    }, [selectedProduct]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full">
                    <div className="relative mb-6">
                        <div className="w-14 h-14 mx-auto relative">
                            <div className="absolute inset-0 bg-primary rounded-full animate-spin opacity-20"></div>
                            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Your Cart</h2>
                    <p className="text-gray-500">Preparing your shopping experience...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full">
                    <div className="w-14 h-14 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-red-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">Connection Error</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={fetchCart}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Your Shopping Cart</h1>
                            <p className="text-gray-500">Manage your items</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                        <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                            <ShoppingCart className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Cart is Empty</h2>
                        <p className="text-gray-500 mb-6">Add some products to get started</p>
                        <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-medium transition-colors inline-flex items-center">
                            Browse Products
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-15 h-15 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Your Shopping Cart</h1>
                            <p className="text-gray-500">{cart.total_items} items</p>
                            <a href="/market" className="text-primary hover:underline text-xs"><ArrowLeft className="w-4 h-4 inline-block" /> Market Place</a>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-gray-700">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <span>Total: {formatPrice(cart.total_price)}</span>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl p-5 border border-gray-100">
                                <div className="flex flex-col sm:flex-row gap-5">
                                    <div className="flex-shrink-0">
                                        <div
                                            className="w-full sm:w-28 h-28 rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                                            onClick={() => setSelectedProduct(item.product)}
                                        >
                                            <img
                                                src={getPrimaryImage(item.product.images)}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format';
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                                            <div className="flex-grow">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3
                                                        className="text-lg font-semibold text-gray-800 hover:text-primary cursor-pointer"
                                                        onClick={() => setSelectedProduct(item.product)}
                                                    >
                                                        {item.product.name}
                                                    </h3>
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setShowDeleteConfirm(showDeleteConfirm === item.id ? null : item.id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>

                                                        {showDeleteConfirm === item.id && (
                                                            <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg p-3 z-10 w-48 border border-gray-100">
                                                                <p className="text-sm text-gray-700 mb-2">Remove this item?</p>
                                                                <div className="flex space-x-2">
                                                                    <button
                                                                        onClick={() => setShowDeleteConfirm(null)}
                                                                        className="flex-1 text-sm py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        onClick={() => deleteCartItem(item.id)}
                                                                        disabled={deleteLoading === item.id}
                                                                        className="flex-1 text-sm py-1 px-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors disabled:opacity-70"
                                                                    >
                                                                        {deleteLoading === item.id ? (
                                                                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                                                        ) : 'Remove'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <p
                                                    className="text-gray-500 text-sm mb-3 line-clamp-2 cursor-pointer"
                                                    onClick={() => setSelectedProduct(item.product)}
                                                >
                                                    {item.product.description}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs ${item.product.condition === 'new'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {item.product.condition}
                                                    </span>

                                                    <div className="flex items-center space-x-1 text-xs">
                                                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                        <span className="text-gray-700">{item.product.rating}</span>
                                                        <span className="text-gray-400">({item.product.review_count})</span>
                                                    </div>

                                                    <span className="text-xs text-gray-500">Stock: {item.product.stock}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:items-end space-y-3">
                                                <div className="text-right">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-lg font-semibold text-gray-800">
                                                            {formatPrice(item.product.price)}
                                                        </span>
                                                        {parseFloat(item.product.original_price) > parseFloat(item.product.price) && (
                                                            <span className="text-sm text-gray-400 line-through">
                                                                {formatPrice(item.product.original_price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-500">Qty:</span>
                                                    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-0.5">
                                                        <button className="p-1.5 hover:bg-gray-200 rounded-md transition-colors">
                                                            <Minus className="w-3 h-3 text-gray-600" />
                                                        </button>
                                                        <span className="w-6 text-center text-sm font-medium text-gray-700">{item.quantity}</span>
                                                        <button className="p-1.5 hover:bg-gray-200 rounded-md transition-colors">
                                                            <Plus className="w-3 h-3 text-gray-600" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="text-right bg-primary/5 p-2 rounded-lg">
                                                    <p className="text-xs text-gray-500">Subtotal</p>
                                                    <p className="text-base font-semibold text-gray-800">
                                                        {formatPrice(parseFloat(item.product.price) * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white rounded-xl p-6 sticky top-6 border border-gray-100">
                            <div className="flex items-center space-x-2 mb-6">
                                <BarChart3 className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-500">Items ({cart.total_items})</span>
                                    <span className="font-medium text-gray-700">{formatPrice(cart.total_price)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="font-medium text-green-500">Free</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-800">Total</span>
                                        <span className="text-lg font-bold text-gray-800">{formatPrice(cart.total_price)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowPaymentModal(true)}
                                className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                            >
                                <CreditCard className="w-4 h-4 mr-2 inline" />
                                Proceed to Checkout
                            </button>
                        </div>

                        {/* Disabled Payment Options Section */}
                        <div className="bg-white rounded-xl p-6 border border-gray-100 opacity-50 pointer-events-none">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Other Payment Options</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">Credit/Debit Card</p>
                                        <p className="text-sm text-gray-500">Pay with Visa, Mastercard, etc.</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C8.26 0 3.588 2.028 0 6.5 3.353 10.772 8.13 12.5 12 12.5c3.87 0 8.647-1.728 12-6.5C20.412 2.028 15.74 0 12 0zm0 9.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">Mobile Money</p>
                                        <p className="text-sm text-gray-500">Pay with MTN, Airtel, etc.</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-4">Coming soon - we're working on adding more payment options</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Details Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-xl font-bold text-gray-800">{selectedProduct.name}</h2>
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <div className="rounded-lg overflow-hidden bg-gray-100 mb-4">
                                        <img
                                            src={getPrimaryImage(selectedProduct.images)}
                                            alt={selectedProduct.name}
                                            className="w-full h-auto object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format';
                                            }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        {selectedProduct.images?.slice(0, 3).map((img, index) => (
                                            <div key={index} className="aspect-square rounded-md overflow-hidden bg-gray-100">
                                                <img
                                                    src={img.image}
                                                    alt={`${selectedProduct.name} ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-6">
                                        <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                                        <p className="text-gray-600">{selectedProduct.description}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg font-bold text-primary">
                                                {formatPrice(selectedProduct.price)}
                                            </span>
                                            {parseFloat(selectedProduct.original_price) > parseFloat(selectedProduct.price) && (
                                                <span className="text-sm text-gray-400 line-through">
                                                    {formatPrice(selectedProduct.original_price)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <span className={`px-2 py-1 rounded-full text-sm ${selectedProduct.condition === 'new'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {selectedProduct.condition}
                                            </span>

                                            <div className="flex items-center space-x-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-gray-700">{selectedProduct.rating}</span>
                                                <span className="text-gray-400">({selectedProduct.review_count})</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-100">
                                            <p className="text-sm text-gray-500 mb-2">Availability</p>
                                            <p className="font-medium text-gray-700">
                                                {selectedProduct.stock > 0
                                                    ? `${selectedProduct.stock} in stock`
                                                    : 'Out of stock'}
                                            </p>
                                        </div>

                                        {isLoadingCategory ? (
                                            <div className="flex items-center space-x-2 text-gray-500">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Loading category...</span>
                                            </div>
                                        ) : categoryError ? (
                                            <p className="text-sm text-red-500">{categoryError}</p>
                                        ) : category && (
                                            <div className="pt-4 border-t border-gray-100">
                                                <p className="text-sm text-gray-500 mb-2">Category</p>
                                                <div className="flex items-center space-x-2">
                                                    {category.image && (
                                                        <img
                                                            src={category.image}
                                                            alt={category.name}
                                                            className="w-8 h-8 rounded-md object-cover"
                                                        />
                                                    )}
                                                    <span className="font-medium text-gray-700">{category.name}</span>
                                                </div>
                                                {category.description && (
                                                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                                                )}
                                            </div>
                                        )}


                                        <div className="pt-4 border-t border-gray-100">
                                            <p className="text-sm text-gray-500 mb-2">Added on</p>
                                            <p className="text-sm text-gray-700">
                                                {new Date(selectedProduct.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full animate-fade-in">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Complete Your Payment</h2>
                                <button
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setSelectedPaymentMethod(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <h3 className="font-medium text-gray-700">Order Summary</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    {cart.items.map(item => (
                                        <div key={item.id} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                                            <span className="text-gray-600">{item.product.name} × {item.quantity}</span>
                                            <span className="font-medium text-gray-700">
                                                {formatPrice(parseFloat(item.product.price) * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between pt-3 mt-2">
                                        <span className="font-semibold text-gray-700">Total</span>
                                        <span className="text-lg font-bold text-gray-800">{formatPrice(cart.total_price)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-medium text-gray-700 mb-3">Payment Method</h3>
                                <div className="space-y-3">
                                    <div
                                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedPaymentMethod === 'whatsapp' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary'}`}
                                        onClick={() => setSelectedPaymentMethod('whatsapp')}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-green-100 p-2 rounded-full">
                                                <MessageCircle className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">WhatsApp Payment</p>
                                                <p className="text-sm text-gray-500">Secure payment via WhatsApp</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border border-gray-200 rounded-lg p-4 opacity-50 pointer-events-none">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-blue-100 p-2 rounded-full">
                                                <CreditCard className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">Credit Card</p>
                                                <p className="text-sm text-gray-500">Pay with Visa, Mastercard, etc.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border border-gray-200 rounded-lg p-4 opacity-50 pointer-events-none">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-purple-100 p-2 rounded-full">
                                                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0C8.26 0 3.588 2.028 0 6.5 3.353 10.772 8.13 12.5 12 12.5c3.87 0 8.647-1.728 12-6.5C20.412 2.028 15.74 0 12 0zm0 9.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">Mobile Money</p>
                                                <p className="text-sm text-gray-500">Pay with MTN, Airtel, etc.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedPaymentMethod === 'whatsapp' ? (
                                <button
                                    onClick={handleWhatsAppPayment}
                                    disabled={paymentLoading}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {paymentLoading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <MessageCircle className="w-4 h-4 mr-2 inline" />
                                            Pay via WhatsApp
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-xl font-medium cursor-not-allowed"
                                >
                                    Select a payment method
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShoppingCartViewer;