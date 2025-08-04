import { BookOpen, Users, Download, FileText } from "lucide-react";

export default function LibraryStats() {
  // These would normally come from API endpoints
  const stats = [
    {
      icon: FileText,
      label: "Total Documents",
      value: "12,847",
      change: "+127 this month",
      color: "text-green-600",
    },
    {
      icon: Users,
      label: "Authors",
      value: "1,234",
      change: "+23 this month",
      color: "text-green-600",
    },
    {
      icon: Download,
      label: "Downloads",
      value: "89,432",
      change: "+1,234 this month",
      color: "text-purple-600",
    },
    {
      icon: BookOpen,
      label: "Collections",
      value: "156",
      change: "+8 this month",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-lg ${stat.color
                      .replace("text-", "bg-")
                      .replace("-600", "-100")}`}
                  >
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">{stat.change}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
