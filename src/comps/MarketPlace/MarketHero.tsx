import { useState, useEffect } from 'react';

import mainAxios from '../Instance/mainAxios';
import { getUserInfo, isLoggedIn } from '../../app/Localstorage';
import Header from './heroSection/Header';
import SecondaryNav from './heroSection/SecondaryNav';
import MainContent from './heroSection/MainContent';

interface Category {
    id: number;
    name: string;
    slug?: string;
    image?: string;
}

interface ProductImage {
    id: number;
    image: string;
    is_primary: boolean;
    product?: number;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: string | number;
    original_price?: string | number;
    condition: 'new' | 'used' | 'refurbished';
    rating: number;
    review_count: number;
    stock: number;
    images: ProductImage[];
    is_featured?: boolean;
    category?: number | Category;
    created_at?: string;
    updated_at?: string;
}

interface UserInfo {
    username: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
}

const ModernEcommerceLayout = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All category');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [selectedCountry, setSelectedCountry] = useState<string>('Rwanda, RWF');
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [user, setUser] = useState<UserInfo | null>(null);

    const [categories, setCategories] = useState<string[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

    const fetchCategories = async (): Promise<void> => {
        try {
            setIsLoadingCategories(true);
            const response = await mainAxios.get<Category[]>('/market/categories/', {
                headers: {
                    'accept': 'application/json'
                }
            });

            setCategories(['All category', ...response.data.map(cat => cat.name)]);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories(['All category']);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const fetchFeaturedProducts = async (): Promise<void> => {
        try {
            setIsLoadingProducts(true);
            const response = await mainAxios.get<Product[]>('/market/products/', {
                params: {
                    is_featured: true,
                },
                headers: {
                    Accept: 'application/json',
                },
            });

            setFeaturedProducts(response.data || []);
        } catch (error) {
            console.error('Error fetching featured products:', error);
            setFeaturedProducts([]);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchFeaturedProducts();

        if (isLoggedIn) {
            const userData = getUserInfo;
            if (userData) {
                setUser(userData as UserInfo);
            }
        }
    }, []);

    const handleSearch = (): void => {
        console.log('Searching for:', searchQuery, 'in category:', selectedCategory);
    };

    const nextSlide = (): void => {
        if (featuredProducts.length > 0) {
            setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
        }
    };

    const prevSlide = (): void => {
        if (featuredProducts.length > 0) {
            setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
        }
    };

    useEffect(() => {
        if (featuredProducts.length > 0) {
            const timer = setInterval(nextSlide, 5000);
            return () => clearInterval(timer);
        }
    }, [featuredProducts]);

    const formatPrice = (price: string | number | undefined): string => {
        if (!price) return 'RWF 0';
        const priceNumber = typeof price === 'string' ? parseFloat(price) : price;
        return `RWF ${priceNumber.toLocaleString()}`;
    };

    const getProductImage = (product: Product | undefined): string => {
        if (!product) return 'https://via.placeholder.com/400x300?text=No+Image';

        if (product?.images && product.images.length > 0) {
            const primaryImage = product.images.find(img => img.is_primary);
            return primaryImage ? primaryImage.image : product.images[0].image;
        }
        return 'https://via.placeholder.com/400x300?text=No+Image';
    };

    return (
        <div className="bg-gray-50 font-sans">
            <Header
                user={user}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                isLoadingCategories={isLoadingCategories}
                handleSearch={handleSearch}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
            <SecondaryNav
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
            />

            <MainContent
                isMobileMenuOpen={isMobileMenuOpen}
                categories={categories}
                featuredProducts={featuredProducts}
                isLoadingProducts={isLoadingProducts}
                currentSlide={currentSlide}
                setCurrentSlide={setCurrentSlide}
                nextSlide={nextSlide}
                prevSlide={prevSlide}
                formatPrice={formatPrice}
                getProductImage={getProductImage}
            />
        </div>
    );
};

export default ModernEcommerceLayout;