import { useState } from "react";
import { Plus, Edit, Trash2, Save, X, Upload } from "lucide-react";
import museumService, {
  type MuseumWithContent,
  type MuseumSection,
} from "../../services/museumService";

interface MuseumContentManagerProps {
  museum: MuseumWithContent;
  onUpdate: (updatedMuseum: MuseumWithContent) => void;
  onClose: () => void;
}

type ContentType =
  | "sections"
  | "gallery"
  | "artifacts"
  | "virtual-exhibitions"
  | "info";

export default function MuseumContentManager({
  museum,
  onUpdate,
  onClose,
}: MuseumContentManagerProps) {
  const [activeTab, setActiveTab] = useState<ContentType>("sections");
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const tabs = [
    { id: "sections", label: "Sections" },
    { id: "gallery", label: "Gallery" },
    { id: "artifacts", label: "Artifacts" },
    { id: "virtual-exhibitions", label: "Virtual Exhibitions" },
    { id: "info", label: "Museum Info" },
  ];

  // Section Management
  const handleCreateSection = async (sectionData: Partial<MuseumSection>) => {
    try {
      setLoading(true);
      const newSection = await museumService.createMuseumSection({
        ...sectionData,
        museum: museum.id,
      });

      const updatedMuseum = {
        ...museum,
        sections: [...(museum.sections || []), newSection],
      };
      onUpdate(updatedMuseum);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating section:", error);
      alert("Failed to create section");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSection = async (
    id: number,
    sectionData: Partial<MuseumSection>
  ) => {
    try {
      setLoading(true);
      const updatedSection = await museumService.updateMuseumSection(
        id,
        sectionData
      );

      const updatedMuseum = {
        ...museum,
        sections:
          museum.sections?.map((section) =>
            section.id === id ? updatedSection : section
          ) || [],
      };
      onUpdate(updatedMuseum);
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating section:", error);
      alert("Failed to update section");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSection = async (id: number) => {
    if (!confirm("Are you sure you want to delete this section?")) return;

    try {
      setLoading(true);
      await museumService.deleteMuseumSection(id);

      const updatedMuseum = {
        ...museum,
        sections: museum.sections?.filter((section) => section.id !== id) || [],
      };
      onUpdate(updatedMuseum);
    } catch (error) {
      console.error("Error deleting section:", error);
      alert("Failed to delete section");
    } finally {
      setLoading(false);
    }
  };

  // Gallery Management
  const handleCreateGalleryItem = async (formData: FormData) => {
    try {
      setLoading(true);
      const newItem = await museumService.createGalleryItem(formData);

      const updatedMuseum = {
        ...museum,
        gallery_items: [...(museum.gallery_items || []), newItem],
      };
      onUpdate(updatedMuseum);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating gallery item:", error);
      alert("Failed to create gallery item");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGalleryItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;

    try {
      setLoading(true);
      await museumService.deleteGalleryItem(id);

      const updatedMuseum = {
        ...museum,
        gallery_items:
          museum.gallery_items?.filter((item) => item.id !== id) || [],
      };
      onUpdate(updatedMuseum);
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      alert("Failed to delete gallery item");
    } finally {
      setLoading(false);
    }
  };

  // Artifact Management
  const handleCreateArtifact = async (formData: FormData) => {
    try {
      setLoading(true);
      const newArtifact = await museumService.createArtifact(formData);

      const updatedMuseum = {
        ...museum,
        artifacts: [...(museum.artifacts || []), newArtifact],
      };
      onUpdate(updatedMuseum);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating artifact:", error);
      alert("Failed to create artifact");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArtifact = async (id: number) => {
    if (!confirm("Are you sure you want to delete this artifact?")) return;

    try {
      setLoading(true);
      await museumService.deleteArtifact(id);

      const updatedMuseum = {
        ...museum,
        artifacts:
          museum.artifacts?.filter((artifact) => artifact.id !== id) || [],
      };
      onUpdate(updatedMuseum);
    } catch (error) {
      console.error("Error deleting artifact:", error);
      alert("Failed to delete artifact");
    } finally {
      setLoading(false);
    }
  };

  // Virtual Exhibition Management
  const handleCreateVirtualExhibition = async (formData: FormData) => {
    try {
      setLoading(true);
      const newExhibition = await museumService.createVirtualExhibition(
        formData
      );

      const updatedMuseum = {
        ...museum,
        virtual_exhibitions: [
          ...(museum.virtual_exhibitions || []),
          newExhibition,
        ],
      };
      onUpdate(updatedMuseum);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating virtual exhibition:", error);
      alert("Failed to create virtual exhibition");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVirtualExhibition = async (id: number) => {
    if (!confirm("Are you sure you want to delete this virtual exhibition?"))
      return;

    try {
      setLoading(true);
      await museumService.deleteVirtualExhibition(id);

      const updatedMuseum = {
        ...museum,
        virtual_exhibitions:
          museum.virtual_exhibitions?.filter(
            (exhibition) => exhibition.id !== id
          ) || [],
      };
      onUpdate(updatedMuseum);
    } catch (error) {
      console.error("Error deleting virtual exhibition:", error);
      alert("Failed to delete virtual exhibition");
    } finally {
      setLoading(false);
    }
  };

  const renderSectionsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Museum Sections</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>

      {museum.sections?.map((section) => (
        <div key={section.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-medium">{section.title}</h4>
              <p className="text-sm text-gray-600">{section.section_type}</p>
              <p className="text-xs text-gray-500 mt-1">
                {section.content?.length || 0} paragraphs
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingItem(section)}
                className="text-blue-600 hover:bg-blue-50 p-1 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteSection(section.id)}
                className="text-red-600 hover:bg-red-50 p-1 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {showForm && activeTab === "sections" && (
        <SectionForm
          onSubmit={handleCreateSection}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingItem && (
        <SectionForm
          section={editingItem}
          onSubmit={(data) => handleUpdateSection(editingItem.id, data)}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </div>
  );

  const renderGalleryTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gallery Items</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Image
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {museum.gallery_items?.map((item) => (
          <div key={item.id} className="border rounded-lg p-4">
            <div className="aspect-video bg-gray-100 rounded mb-2">
              <img
                src={item.image_url || item.image}
                alt={item.title}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <h4 className="font-medium text-sm">{item.title}</h4>
            <p className="text-xs text-gray-600 truncate">{item.description}</p>
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => handleDeleteGalleryItem(item.id)}
                className="text-red-600 hover:bg-red-50 p-1 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && activeTab === "gallery" && (
        <GalleryForm
          museumId={museum.id}
          onSubmit={handleCreateGalleryItem}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );

  const renderArtifactsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Artifacts</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Artifact
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {museum.artifacts?.map((artifact) => (
          <div key={artifact.id} className="border rounded-lg p-4">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                {artifact.image_url || artifact.image ? (
                  <img
                    src={artifact.image_url || artifact.image}
                    alt={artifact.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{artifact.name}</h4>
                <p className="text-sm text-blue-600">{artifact.category}</p>
                <p className="text-xs text-gray-500">
                  {artifact.historical_period}
                </p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {artifact.description}
                </p>
              </div>
              <button
                onClick={() => handleDeleteArtifact(artifact.id)}
                className="text-red-600 hover:bg-red-50 p-1 rounded h-fit"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && activeTab === "artifacts" && (
        <ArtifactForm
          museumId={museum.id}
          onSubmit={handleCreateArtifact}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );

  const renderVirtualExhibitionsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Virtual Exhibitions</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Exhibition
        </button>
      </div>

      {museum.virtual_exhibitions?.map((exhibition) => (
        <div key={exhibition.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-medium">{exhibition.title}</h4>
              <p className="text-sm text-blue-600">
                {exhibition.exhibition_type}
              </p>
              <p className="text-xs text-gray-500">{exhibition.duration}</p>
              <p className="text-xs text-gray-600 mt-1">
                {exhibition.description}
              </p>
              <a
                href={exhibition.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline"
              >
                {exhibition.url}
              </a>
            </div>
            <div className="flex gap-2">
              {exhibition.is_featured && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Featured
                </span>
              )}
              <button
                onClick={() => handleDeleteVirtualExhibition(exhibition.id)}
                className="text-red-600 hover:bg-red-50 p-1 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {showForm && activeTab === "virtual-exhibitions" && (
        <VirtualExhibitionForm
          museumId={museum.id}
          onSubmit={handleCreateVirtualExhibition}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );

  const renderInfoTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Museum Information</h3>
      <MuseumInfoForm museum={museum} onUpdate={onUpdate} />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Manage {museum.name} Content</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ContentType)}
              className={`px-4 py-2 font-medium ${
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {activeTab === "sections" && renderSectionsTab()}
          {activeTab === "gallery" && renderGalleryTab()}
          {activeTab === "artifacts" && renderArtifactsTab()}
          {activeTab === "virtual-exhibitions" && renderVirtualExhibitionsTab()}
          {activeTab === "info" && renderInfoTab()}
        </div>
      </div>
    </div>
  );
}

// Form Components (simplified versions - you can expand these)

function SectionForm({
  section,
  onSubmit,
  onCancel,
}: {
  section?: MuseumSection;
  onSubmit: (data: Partial<MuseumSection>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    section_type: section?.section_type || "overview",
    title: section?.title || "",
    content: section?.content || [""],
    order: section?.order || 0,
    is_active: section?.is_active ?? true,
  });

  const sectionTypes = [
    { value: "overview", label: "Overview" },
    { value: "cultural-heritage", label: "Cultural Heritage" },
    { value: "natural-history", label: "Natural History" },
    { value: "history", label: "History" },
    { value: "exhibitions", label: "Exhibitions" },
    { value: "custom", label: "Custom Section" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      content: [...prev.content, ""],
    }));
  };

  const updateParagraph = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.map((p, i) => (i === index ? value : p)),
    }));
  };

  const removeParagraph = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Section Type
            </label>
            <select
              value={formData.section_type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  section_type: e.target.value,
                }))
              }
              className="w-full p-2 border rounded"
              required
            >
              {sectionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">
              Content Paragraphs
            </label>
            <button
              type="button"
              onClick={addParagraph}
              className="text-sm text-primary hover:underline"
            >
              + Add Paragraph
            </button>
          </div>
          {formData.content.map((paragraph, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <textarea
                value={paragraph}
                onChange={(e) => updateParagraph(index, e.target.value)}
                className="flex-1 p-2 border rounded"
                rows={3}
                placeholder={`Paragraph ${index + 1}`}
              />
              {formData.content.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  order: parseInt(e.target.value),
                }))
              }
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_active: e.target.checked,
                }))
              }
              className="mr-2"
            />
            <label htmlFor="is_active" className="text-sm font-medium">
              Active
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {section ? "Update" : "Create"} Section
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function GalleryForm({
  museumId,
  onSubmit,
  onCancel,
}: {
  museumId: number;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 0,
    is_featured: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("museum", museumId.toString());
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("order", formData.order.toString());
    data.append("is_featured", formData.is_featured.toString());

    if (selectedFile) {
      data.append("image", selectedFile);
    } else if (imageUrl) {
      data.append("image_url", imageUrl);
    }

    onSubmit(data);
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  order: parseInt(e.target.value),
                }))
              }
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
          <div className="text-center my-2 text-gray-500">OR</div>
          <input
            type="url"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="gallery_featured"
            checked={formData.is_featured}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                is_featured: e.target.checked,
              }))
            }
            className="mr-2"
          />
          <label htmlFor="gallery_featured" className="text-sm font-medium">
            Featured
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Add Gallery Item
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function ArtifactForm({
  museumId,
  onSubmit,
  onCancel,
}: {
  museumId: number;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "other",
    historical_period: "",
    origin: "",
    materials: "",
    dimensions: "",
    acquisition_method: "",
    order: 0,
    is_on_display: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const categories = [
    { value: "royal-regalia", label: "Royal Regalia" },
    { value: "ceremonial-weapons", label: "Ceremonial Weapons" },
    { value: "musical-instruments", label: "Musical Instruments" },
    { value: "domestic-items", label: "Domestic Items" },
    { value: "religious-objects", label: "Religious Objects" },
    { value: "artwork", label: "Artwork" },
    { value: "tools", label: "Tools" },
    { value: "textiles", label: "Textiles" },
    { value: "jewelry", label: "Jewelry" },
    { value: "pottery", label: "Pottery" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("museum", museumId.toString());
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });

    if (selectedFile) {
      data.append("image", selectedFile);
    } else if (imageUrl) {
      data.append("image_url", imageUrl);
    }

    onSubmit(data);
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Historical Period
            </label>
            <input
              type="text"
              value={formData.historical_period}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  historical_period: e.target.value,
                }))
              }
              className="w-full p-2 border rounded"
              placeholder="e.g., 18th Century"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Origin</label>
            <input
              type="text"
              value={formData.origin}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, origin: e.target.value }))
              }
              className="w-full p-2 border rounded"
              placeholder="Place of origin"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Materials</label>
            <input
              type="text"
              value={formData.materials}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, materials: e.target.value }))
              }
              className="w-full p-2 border rounded"
              placeholder="e.g., Wood, Metal, Cloth"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dimensions</label>
            <input
              type="text"
              value={formData.dimensions}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dimensions: e.target.value }))
              }
              className="w-full p-2 border rounded"
              placeholder="e.g., 30cm x 20cm x 15cm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
          <div className="text-center my-2 text-gray-500">OR</div>
          <input
            type="url"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="artifact_display"
            checked={formData.is_on_display}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                is_on_display: e.target.checked,
              }))
            }
            className="mr-2"
          />
          <label htmlFor="artifact_display" className="text-sm font-medium">
            On Display
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Add Artifact
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function VirtualExhibitionForm({
  museumId,
  onSubmit,
  onCancel,
}: {
  museumId: number;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    exhibition_type: "tour",
    url: "",
    duration: "",
    is_featured: false,
    is_active: true,
    requires_registration: false,
    access_instructions: "",
    technical_requirements: "",
    order: 0,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const exhibitionTypes = [
    { value: "tour", label: "Virtual Tour" },
    { value: "experience", label: "360° Experience" },
    { value: "exhibition", label: "Digital Exhibition" },
    { value: "interactive", label: "Interactive Experience" },
    { value: "documentary", label: "Documentary" },
    { value: "audio-guide", label: "Audio Guide" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("museum", museumId.toString());
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });

    if (selectedFile) {
      data.append("thumbnail_image", selectedFile);
    } else if (thumbnailUrl) {
      data.append("thumbnail_url", thumbnailUrl);
    }

    onSubmit(data);
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Exhibition Type
            </label>
            <select
              value={formData.exhibition_type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  exhibition_type: e.target.value,
                }))
              }
              className="w-full p-2 border rounded"
              required
            >
              {exhibitionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, url: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, duration: e.target.value }))
              }
              className="w-full p-2 border rounded"
              placeholder="e.g., 45 minutes"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Thumbnail Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
          <div className="text-center my-2 text-gray-500">OR</div>
          <input
            type="url"
            placeholder="Thumbnail URL"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Access Instructions
          </label>
          <textarea
            value={formData.access_instructions}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                access_instructions: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
            rows={2}
            placeholder="Instructions for accessing this virtual exhibition"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ve_featured"
              checked={formData.is_featured}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_featured: e.target.checked,
                }))
              }
              className="mr-2"
            />
            <label htmlFor="ve_featured" className="text-sm font-medium">
              Featured
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ve_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_active: e.target.checked,
                }))
              }
              className="mr-2"
            />
            <label htmlFor="ve_active" className="text-sm font-medium">
              Active
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ve_registration"
              checked={formData.requires_registration}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  requires_registration: e.target.checked,
                }))
              }
              className="mr-2"
            />
            <label htmlFor="ve_registration" className="text-sm font-medium">
              Requires Registration
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Add Virtual Exhibition
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function MuseumInfoForm({
  museum,
  onUpdate,
}: {
  museum: MuseumWithContent;
  onUpdate: (updatedMuseum: MuseumWithContent) => void;
}) {
  const [formData, setFormData] = useState({
    hours: museum.additional_info?.hours || "9:00 AM - 5:00 PM",
    contact: museum.additional_info?.contact || museum.phone || "",
    admission: museum.additional_info?.admission || "",
    facilities: museum.additional_info?.facilities || [],
    directions: museum.additional_info?.directions || "",
    parking_info: museum.additional_info?.parking_info || "",
    accessibility_info: museum.additional_info?.accessibility_info || "",
    group_booking_info: museum.additional_info?.group_booking_info || "",
    special_programs: museum.additional_info?.special_programs || [],
  });
  const [loading, setLoading] = useState(false);
  const [newFacility, setNewFacility] = useState("");
  const [newProgram, setNewProgram] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (museum.additional_info?.id) {
        // Update existing info
        const updatedInfo = await museumService.updateMuseumInfo(
          museum.additional_info.id,
          formData
        );
        onUpdate({
          ...museum,
          additional_info: updatedInfo,
        });
      } else {
        // Create new info
        const newInfo = await museumService.createMuseumInfo({
          ...formData,
          museum: museum.id,
        });
        onUpdate({
          ...museum,
          additional_info: newInfo,
        });
      }

      alert("Museum information updated successfully!");
    } catch (error) {
      console.error("Error updating museum info:", error);
      alert("Failed to update museum information");
    } finally {
      setLoading(false);
    }
  };

  const addFacility = () => {
    if (newFacility.trim()) {
      setFormData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()],
      }));
      setNewFacility("");
    }
  };

  const removeFacility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index),
    }));
  };

  const addProgram = () => {
    if (newProgram.trim()) {
      setFormData((prev) => ({
        ...prev,
        special_programs: [...prev.special_programs, newProgram.trim()],
      }));
      setNewProgram("");
    }
  };

  const removeProgram = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      special_programs: prev.special_programs.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Opening Hours
          </label>
          <input
            type="text"
            value={formData.hours}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, hours: e.target.value }))
            }
            className="w-full p-2 border rounded"
            placeholder="e.g., 9:00 AM - 5:00 PM"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact</label>
          <input
            type="text"
            value={formData.contact}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, contact: e.target.value }))
            }
            className="w-full p-2 border rounded"
            placeholder="Phone number or email"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Admission Information
        </label>
        <textarea
          value={formData.admission}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, admission: e.target.value }))
          }
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="Admission pricing and details"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Directions</label>
        <textarea
          value={formData.directions}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, directions: e.target.value }))
          }
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="How to get to the museum"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Parking Information
          </label>
          <textarea
            value={formData.parking_info}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, parking_info: e.target.value }))
            }
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Parking details"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Accessibility Information
          </label>
          <textarea
            value={formData.accessibility_info}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                accessibility_info: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Accessibility features"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Group Booking Information
        </label>
        <textarea
          value={formData.group_booking_info}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              group_booking_info: e.target.value,
            }))
          }
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="Information for group bookings"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Facilities</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newFacility}
            onChange={(e) => setNewFacility(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Add facility"
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addFacility())
            }
          />
          <button
            type="button"
            onClick={addFacility}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.facilities.map((facility, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
            >
              {facility}
              <button
                type="button"
                onClick={() => removeFacility(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Special Programs
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newProgram}
            onChange={(e) => setNewProgram(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Add special program"
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addProgram())
            }
          />
          <button
            type="button"
            onClick={addProgram}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.special_programs.map((program, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
            >
              {program}
              <button
                type="button"
                onClick={() => removeProgram(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-6 py-2 rounded flex items-center gap-2 disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {loading ? "Saving..." : "Save Museum Information"}
      </button>
    </form>
  );
}
