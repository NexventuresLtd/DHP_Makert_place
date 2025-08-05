import React, { useState, useEffect } from 'react';
import {
    ShoppingCart,
    Search,
    Eye,
    Trash2,
    Users,
    Package,
    AlertCircle,
    Loader2,
    DollarSign,
    RefreshCw,
    X,
    Star,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import type { Cart, ProductImage } from '../../../types/marketTypes';
import mainAxios from '../../Instance/mainAxios';

interface AdminCart extends Cart {
    user?: {
        id: number;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
    };
}

const AdminCartsViewer: React.FC = () => {
    const [carts, setCarts] = useState<AdminCart[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'empty'>('all');
    const [sortBy, setSortBy] = useState<'date' | 'total' | 'items'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedCart, setSelectedCart] = useState<AdminCart | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

    const fetchCarts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await mainAxios.get('/market/cart/');
            setCarts(response.data.results || []);
        } catch (err) {
            setError('Failed to load carts. Please try again.');
            console.error('Error fetching carts:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteCart = async (cartId: number) => {
        try {
            setDeleteLoading(cartId);
            await mainAxios.delete(`/market/cart/${cartId}/`);
            setCarts(prevCarts => prevCarts.filter(cart => cart.id !== cartId));
            setShowDeleteConfirm(null);
        } catch (err) {
            setError('Failed to delete cart. Please try again.');
            console.error('Error deleting cart:', err);
        } finally {
            setDeleteLoading(null);
        }
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getUserDisplayName = (cart: AdminCart) => {
        if (!cart.user) return 'Unknown User';
        const { first_name, last_name, username } = cart.user;
        if (first_name && last_name) {
            return `${first_name} ${last_name}`;
        }
        return username || `User #${cart.user.id}`;
    };

    const filteredAndSortedCarts = React.useMemo(() => {
        let filtered = carts.filter(cart => {
            const matchesSearch = !searchTerm ||
                getUserDisplayName(cart).toLowerCase().includes(searchTerm.toLowerCase()) ||
                cart.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cart.id.toString().includes(searchTerm);

            const matchesFilter = filterStatus === 'all' ||
                (filterStatus === 'active' && cart.items.length > 0) ||
                (filterStatus === 'empty' && cart.items.length === 0);

            return matchesSearch && matchesFilter;
        });

        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'date':
                    comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
                    break;
                case 'total':
                    comparison = (
                        typeof a.total_price === 'string' ? parseFloat(a.total_price) : a.total_price
                    ) - (
                            typeof b.total_price === 'string' ? parseFloat(b.total_price) : b.total_price
                        );
                    break;
                case 'items':
                    comparison = a.total_items - b.total_items;
                    break;
            }
            return sortOrder === 'desc' ? -comparison : comparison;
        });

        return filtered;
    }, [carts, searchTerm, filterStatus, sortBy, sortOrder]);

    const stats = React.useMemo(() => {
        const totalCarts = carts.length;
        const activeCarts = carts.filter(cart => cart.items.length > 0).length;
        const totalValue = carts.reduce(
            (sum, cart) =>
                sum +
                (typeof cart.total_price === 'string'
                    ? parseFloat(cart.total_price)
                    : cart.total_price),
            0
        );
        const totalItems = carts.reduce((sum, cart) => sum + cart.total_items, 0);

        return {
            totalCarts,
            activeCarts,
            totalValue,
            totalItems,
            emptyCartsPercent: totalCarts > 0 ? ((totalCarts - activeCarts) / totalCarts) * 100 : 0
        };
    }, [carts]);

    useEffect(() => {
        fetchCarts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full">
                    <div className="relative mb-6">
                        <div className="w-14 h-14 mx-auto relative">
                            <div className="absolute inset-0 bg-primary rounded-full animate-spin opacity-20"></div>
                            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Carts</h2>
                    <p className="text-gray-500">Fetching all shopping carts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full">
                    <div className="w-14 h-14 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">Error Loading Carts</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={fetchCarts}
                        className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors inline-flex items-center"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Shopping Carts</h1>
                                <p className="text-gray-500">Manage all user shopping carts</p>
                            </div>
                        </div>
                        <button
                            onClick={fetchCarts}
                            className="inline-flex items-center px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Carts</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalCarts}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Active Carts</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.activeCarts}</p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Value</p>
                                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalValue)}</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Items</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                            </div>
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by user name, email, or cart ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'empty')}
                                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Carts</option>
                                <option value="active">Active Carts</option>
                                <option value="empty">Empty Carts</option>
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'date' | 'total' | 'items')}
                                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="date">Sort by Date</option>
                                <option value="total">Sort by Total</option>
                                <option value="items">Sort by Items</option>
                            </select>

                            <button
                                onClick={() => setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc')}
                                className="px-3 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Carts List */}
                <div className="bg-white rounded-xl overflow-hidden">
                    {filteredAndSortedCarts.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No carts found</h3>
                            <p className="text-gray-500">
                                {searchTerm || filterStatus !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'No shopping carts available'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredAndSortedCarts.map((cart) => (
                                <div key={cart.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                        {getUserDisplayName(cart)}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                                        <span>Cart #{cart.id}</span>
                                                        <span>•</span>
                                                        <span>{cart.user?.email || 'No email'}</span>
                                                        <span>•</span>
                                                        <span>{formatDate(cart.updated_at)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cart.items.length > 0
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {cart.items.length > 0 ? 'Active' : 'Empty'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Items</p>
                                                    <p className="font-semibold text-gray-900">{cart.total_items}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Total Value</p>
                                                    <p className="font-semibold text-gray-900">{formatPrice(cart.total_price)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Created</p>
                                                    <p className="font-semibold text-gray-900">{formatDate(cart.created_at)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                                                    <p className="font-semibold text-gray-900">{formatDate(cart.updated_at)}</p>
                                                </div>
                                            </div>

                                            {cart.items.length > 0 && (
                                                <div className="flex items-center space-x-2 mb-3">
                                                    <p className="text-sm text-gray-600">Recent items:</p>
                                                    <div className="flex space-x-2">
                                                        {cart.items.slice(0, 3).map((item) => (
                                                            <div key={item.id} className="flex items-center space-x-1">
                                                                <img
                                                                    src={getPrimaryImage(item.product.images)}
                                                                    alt={item.product.name}
                                                                    className="w-6 h-6 rounded object-cover"
                                                                />
                                                                <span className="text-sm text-gray-700 truncate max-w-20">
                                                                    {item.product.name}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {cart.items.length > 3 && (
                                                            <span className="text-sm text-gray-500">
                                                                +{cart.items.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-2 min-h-72">
                                            <button
                                                onClick={() => setSelectedCart(cart)}
                                                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium transition-colors inline-flex items-center"
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </button>

                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowDeleteConfirm(showDeleteConfirm === cart.id ? null : cart.id)}
                                                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors inline-flex items-center"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Delete
                                                </button>

                                                {showDeleteConfirm === cart.id && (
                                                    <div className="absolute right-0 top-12 bg-white rounded-lg p-4 z-10 w-56 border border-gray-200">
                                                        <p className="text-sm text-gray-700 mb-3">Delete this cart permanently?</p>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => setShowDeleteConfirm(null)}
                                                                className="flex-1 text-sm py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => deleteCart(cart.id)}
                                                                disabled={deleteLoading === cart.id}
                                                                className="flex-1 text-sm py-2 px-3 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors disabled:opacity-70"
                                                            >
                                                                {deleteLoading === cart.id ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                                                ) : 'Delete'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Cart Details Modal */}
            {selectedCart && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                                        {getUserDisplayName(selectedCart)}'s Cart
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                        <span>Cart #{selectedCart.id}</span>
                                        <span>•</span>
                                        <span>{selectedCart.user?.email}</span>
                                        <span>•</span>
                                        <span>{formatDate(selectedCart.updated_at)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCart(null)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {selectedCart.items.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                        <ShoppingCart className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Empty Cart</h3>
                                    <p className="text-gray-500">This cart doesn't contain any items.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Total Items</p>
                                            <p className="text-lg font-semibold text-gray-900">{selectedCart.total_items}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Total Value</p>
                                            <p className="text-lg font-semibold text-gray-900">{formatPrice(selectedCart.total_price)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Created</p>
                                            <p className="text-lg font-semibold text-gray-900">{formatDate(selectedCart.created_at)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                                            <p className="text-lg font-semibold text-gray-900">{formatDate(selectedCart.updated_at)}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-semibold text-gray-900">Cart Items</h3>
                                        {selectedCart.items.map((item) => (
                                            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={getPrimaryImage(item.product.images)}
                                                            alt={item.product.name}
                                                            className="w-16 h-16 rounded-lg object-cover"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format';
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 mb-1">
                                                                    {item.product.name}
                                                                </h4>
                                                                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                                                    {item.product.description}
                                                                </p>
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className={`px-2 py-1 rounded-full text-xs ${item.product.condition === 'new'
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
                                                            <div className="text-right">
                                                                <p className="font-semibold text-gray-900 mb-1">
                                                                    {formatPrice(item.product.price)}
                                                                </p>
                                                                <p className="text-sm text-gray-500 mb-2">
                                                                    Qty: {item.quantity}
                                                                </p>
                                                                <p className="font-semibold text-blue-600">
                                                                    {formatPrice(parseFloat(item.product.price) * item.quantity)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCartsViewer;