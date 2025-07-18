// components/GenericContent.tsx
interface GenericContentProps {
  title: string;
  description: string;
}

export const GenericContent: React.FC<GenericContentProps> = ({ title, description }) => {
  return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-bold text-primary mb-4">{title}</h2>
      <p className="text-gray-400 text-lg">{description}</p>
      <button className="mt-6 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
        Coming Soon
      </button>
    </div>
  );
};