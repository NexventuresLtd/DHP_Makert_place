
import { useEffect, useState } from 'react';
import { fetchCategories } from '../app/utlis/getCategoriesUtils';
import RwandanEcommerceLayout from '../comps/MarketPlace/MarketDis';
import EcommerceLayout from '../comps/MarketPlace/MarketHero';
import RecommendedItemsSection from '../comps/MarketPlace/MarketPlaceReco';
import SupplierInquiryForm from '../comps/MarketPlace/MarketPlacetrust';
// import ProductCatalog from '../comps/MarketPlace/MarketProducts';
import Footer from '../comps/sharedComps/Footer';
import type { Category } from '../types/marketTypes';
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
    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <EcommerceLayout />
                {loading &&
                    <div className="max-w-full md:max-w-11/12 mx-auto p-6 bg-gradient-to-br from-gray-50 to-white">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    </div>
                }
                {categories.map((data: any) => (
                    <RwandanEcommerceLayout data={data} />
                ))}
                <SupplierInquiryForm />
                {/* <ProductCatalog /> */}
                <RecommendedItemsSection />
                <Footer />
            </div>
        </>
    )
}

export default MarketPlace
