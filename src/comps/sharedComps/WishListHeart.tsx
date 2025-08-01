// components/WishlistHeart.tsx
import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { isLoggedIn } from "../../app/Localstorage";
import { toggleProductInWishlist } from "../../app/utlis/addwishlist";


interface WishlistHeartProps {
  productId: number;
  size?: number; // Optional size prop for the icon
  className?: string; // Optional className for styling
}

export function WishlistHeart({ productId, size = 20, className = "" }: WishlistHeartProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // // Check initial wishlist status
  // useEffect(() => {
  //   // let isMounted = true;
    
  //   // const checkStatus = async () => {
  //   //   // if (isLoggedIn) {
  //   //   //   setIsLoading(true);
  //   //   //   try {
  //   //   //     const status = await checkWishlistStatus(productId);
  //   //   //     if (isMounted) setIsWishlisted(status);
  //   //   //   } catch (error) {
  //   //   //     console.error("Error checking wishlist status:", error);
  //   //   //   } finally {
  //   //   //     if (isMounted) setIsLoading(false);
  //   //   //   }
  //   //   // }
  //   // };

  //   // checkStatus();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [productId]);

  const handleToggleWishlist = async () => {
    if (!isLoggedIn) {
      alert("Please login to manage your wishlist");
      return;
    }

    setIsLoading(true);
    try {
      const result = await toggleProductInWishlist(productId);
      if (result.status) {
        setIsWishlisted(result.is_wishlisted ?? !isWishlisted);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine the heart icon appearance
  const getHeartIcon = () => {
    if (isLoading) {
      return <Loader2 size={size} className="animate-spin" />;
    }
    
    const isFilled = isWishlisted || (isHovered && !isWishlisted);
    
    return (
      <Heart
        size={size}
        className={isFilled ? "fill-current" : ""}
        color={isWishlisted ? "red" : isHovered ? "red" : "lightgray"}
      />
    );
  };

  return (
    <button
      onClick={handleToggleWishlist}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isLoading}
      className={`p-2 rounded-full transition-colors duration-200 fill-red-500 hidden ${
        isWishlisted ? "bg-red-50" : "hover:bg-gray-100"
      } ${className}`}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {getHeartIcon()}
    </button>
  );
}