import { useState } from "react";
import { X, Upload, Building2 } from "lucide-react";
import { createMuseum, updateMuseum } from "../../services/museumService";
import type { Museum } from "../../services/museumService";

interface CreateMuseumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (museum: Museum) => void;
  initialData?: Museum; // For editing existing museums
}

export default function CreateMuseumModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: CreateMuseumModalProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    long_description: initialData?.long_description || "",
    location: initialData?.location || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    country: initialData?.country || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    website: initialData?.website || "",
    opening_hours:
      typeof initialData?.opening_hours === "string"
        ? initialData.opening_hours
        : initialData?.opening_hours
        ? JSON.stringify(initialData.opening_hours)
        : "",
    admission_fee: initialData?.admission_fee || "",
    admission_info: initialData?.admission_info || "",
    established_year: initialData?.established_year || new Date().getFullYear(),
    has_parking: initialData?.has_parking || false,
    has_wifi: initialData?.has_wifi || false,
    has_restaurant: initialData?.has_restaurant || false,
    has_gift_shop: initialData?.has_gift_shop || false,
    is_wheelchair_accessible: initialData?.is_wheelchair_accessible || false,
    has_guided_tours: initialData?.has_guided_tours || false,
    tags: initialData?.tags || "",
    status: initialData?.status || "active",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setCreating(true);
    try {
      // Prepare form data for API
      const museumData = new FormData();

      // Add text fields
      museumData.append("name", formData.name);
      museumData.append("description", formData.description);
      museumData.append("long_description", formData.long_description);
      museumData.append("location", formData.location);
      museumData.append("address", formData.address);
      museumData.append("city", formData.city);
      museumData.append("country", formData.country);
      museumData.append("phone", formData.phone);
      museumData.append("email", formData.email);
      museumData.append("website", formData.website);
      museumData.append("admission_fee", formData.admission_fee);
      museumData.append("admission_info", formData.admission_info);
      museumData.append(
        "established_year",
        formData.established_year.toString()
      );
      museumData.append("status", formData.status);

      // Add boolean fields
      museumData.append("has_parking", formData.has_parking.toString());
      museumData.append("has_wifi", formData.has_wifi.toString());
      museumData.append("has_restaurant", formData.has_restaurant.toString());
      museumData.append("has_gift_shop", formData.has_gift_shop.toString());
      museumData.append(
        "is_wheelchair_accessible",
        formData.is_wheelchair_accessible.toString()
      );
      museumData.append(
        "has_guided_tours",
        formData.has_guided_tours.toString()
      );

      // Add tags as JSON array
      if (formData.tags) {
        const tagsArray = formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
        museumData.append("tags", JSON.stringify(tagsArray));
      }

      // Add opening hours as string
      museumData.append("opening_hours", formData.opening_hours);

      // Add image if selected
      if (selectedImage) {
        museumData.append("main_image", selectedImage);
      }

      let response;
      if (initialData) {
        // Editing existing museum
        response = await updateMuseum(initialData.slug.toString(), museumData);
      } else {
        // Creating new museum
        response = await createMuseum(museumData);
      }

      onSuccess?.(response);
      onClose();
      resetForm();
    } catch (error) {
      console.error(
        `Failed to ${initialData ? "update" : "create"} museum:`,
        error
      );
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      long_description: "",
      location: "",
      address: "",
      city: "",
      country: "",
      phone: "",
      email: "",
      website: "",
      opening_hours: "",
      admission_fee: "",
      admission_info: "",
      established_year: new Date().getFullYear(),
      has_parking: false,
      has_wifi: false,
      has_restaurant: false,
      has_gift_shop: false,
      is_wheelchair_accessible: false,
      has_guided_tours: false,
      tags: "",
      status: "active",
    });
    setSelectedImage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? "Edit Museum Profile" : "Create Museum Profile"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Museum Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Museum Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                {selectedImage ? (
                  <div className="space-y-2">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Preview"
                      className="mx-auto h-32 object-cover rounded-lg"
                    />
                    <p className="text-sm text-gray-600">
                      {selectedImage.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedImage(null)}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Click to upload museum image
                        </span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) =>
                            setSelectedImage(e.target.files?.[0] || null)
                          }
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Museum Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="City, Country"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the museum..."
              />
            </div>

            {/* Museum Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Established Year
                </label>
                <input
                  type="number"
                  value={formData.established_year}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      established_year: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admission Fee
                </label>
                <input
                  type="text"
                  value={formData.admission_fee}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      admission_fee: e.target.value,
                    }))
                  }
                  placeholder="Free, $10, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, website: e.target.value }))
                }
                placeholder="https://museum-website.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opening Hours
              </label>
              <textarea
                value={
                  typeof formData.opening_hours === "string"
                    ? formData.opening_hours
                    : JSON.stringify(formData.opening_hours)
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    opening_hours: e.target.value,
                  }))
                }
                placeholder="Mon-Fri: 9AM-5PM, Sat-Sun: 10AM-6PM"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admission Info
              </label>
              <input
                type="text"
                value={formData.admission_info}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    admission_info: e.target.value,
                  }))
                }
                placeholder="Additional admission information"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="Separate tags with commas"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={creating || !formData.name}
              >
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    {initialData ? "Update Museum" : "Create Museum"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
