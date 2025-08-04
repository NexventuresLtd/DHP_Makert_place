
import { useEffect, useState } from 'react';

import RwandanEcommerceLayout from '../comps/MarketPlace/MarketDis';
import RecommendedItemsSection from '../comps/MarketPlace/MarketPlaceReco';
import SupplierInquiryForm from '../comps/MarketPlace/MarketPlacetrust';
// import ProductCatalog from '../comps/MarketPlace/MarketProducts';
import Footer from '../comps/sharedComps/Footer';
import type { Category, Category_nav, Product, UserInfo } from '../types/marketTypes';
import ProductsShowcase from '../comps/MarketPlace/nonFeuturedProducINCategories';
import IrageBanner from '../comps/MarketPlace/banner';
import IrageServices from '../comps/MarketPlace/heroSection/servicesMarket';

import SecondaryNav from '../comps/MarketPlace/heroSection/SecondaryNav';
import Header from '../comps/MarketPlace/heroSection/Header';
import mainAxios from '../comps/Instance/mainAxios';

import { getUserInfo, isLoggedIn } from '../app/Localstorage';
import { fetchCategories } from '../app/utlis/getCategoriesUtils';
import MainContent from '../comps/MarketPlace/heroSection/MainContent';
import ProductSearch from '../comps/MarketPlace/searchComp';

const MarketPlace = () => {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([]);
    useEffect(() => {
        setLoading(true)
        const loadCategories = async () => {
            try {
                const newData = await fetchCategories();
                setCategories(newData);
                setLoading(false)
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                setLoading(false)
            }
        };

        loadCategories();
    }, []);
    //----------------------------------------------------------------
    const [selectedCategory, setSelectedCategory] = useState<string>('All category');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [selectedCountry, setSelectedCountry] = useState<string>('Rwanda, RWF');
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [user, setUser] = useState<UserInfo | null>(null);
    const [categories_nav, setCategories_nav] = useState<string[]>(['All category']);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

    const fetchCategories_nav = async (): Promise<void> => {
        try {
            setIsLoadingCategories(true);
            const response = await mainAxios.get<Category_nav[]>('/market/categories/', {
                headers: {
                    'accept': 'application/json'
                }
            });

            setCategories_nav(['All category', ...response.data.map(cat => cat.name)]);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories_nav(['All category']);
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
        fetchCategories_nav();
        fetchFeaturedProducts();

        if (isLoggedIn) {
            const userData = getUserInfo;
            if (userData) {
                setUser(userData as UserInfo);
            }
        }
    }, []);
    const [searchMode, setSearchMode] = useState<boolean>(false);
    const handleSearch = async (): Promise<void> => {
        setSearchMode(true);
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
        <>
            <div className="min-h-screen bg-gray-50">

                <div className="sticky top-0 z-50">
                    <Header
                        user={user}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        categories={categories_nav}
                        isLoadingCategories={isLoadingCategories}
                        handleSearch={handleSearch}
                        isMobileMenuOpen={isMobileMenuOpen}
                        setIsMobileMenuOpen={setIsMobileMenuOpen}
                    />
                    <SecondaryNav
                        selectedCountry={selectedCountry}
                        setSelectedCountry={setSelectedCountry}
                    />
                </div>
                {searchMode && <ProductSearch onClose={() => setSearchMode(false)} searchTerm={searchQuery} selectedCategory={selectedCategory} />}
                {!searchMode &&
                    <main>

                        <MainContent
                            isMobileMenuOpen={isMobileMenuOpen}
                            categories={categories_nav}
                            featuredProducts={featuredProducts}
                            isLoadingProducts={isLoadingProducts}
                            currentSlide={currentSlide}
                            setCurrentSlide={setCurrentSlide}
                            nextSlide={nextSlide}
                            prevSlide={prevSlide}
                            formatPrice={formatPrice}
                            getProductImage={getProductImage}
                        />

                        <IrageServices />
                        {loading &&
                            <div className="max-w-full md:max-w-11/12 mx-auto p-6 bg-gradient-to-br from-gray-50 to-white">
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            </div>
                        }
                        <div className="bg-[url('/images/research.png')] bg-center bg-repeat bg-blend-overlay bg-white/90 backdrop-blur-3xl">
                            <RecommendedItemsSection />
                        </div>
                        <SupplierInquiryForm />
                        {categories.map((data: any) => (
                            <RwandanEcommerceLayout data={data} />
                        ))}
                        <IrageBanner />
                        {categories.map((data: any) => (
                            <ProductsShowcase data={data} />
                        ))}
                        {/* <ProductCatalog /> */}
                        <Footer />
                    </main>}
            </div>
        </>
    )
}

export default MarketPlace
