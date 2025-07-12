import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
  color?: "default" | "green" | "yellow" | "red";
}

export default function StatsCard({
  title,
  value,
  color = "default",
}: StatsCardProps) {
  const getValueColor = () => {
    switch (color) {
      case "green":
        return "text-green-600";
      case "yellow":
        return "text-yellow-600";
      case "red":
        return "text-red-600";
      default:
        return "text-gray-900";
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-2 px-4 lg:px-6">
        <CardTitle className="text-xs lg:text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
        <span
          className={`text-2xl lg:text-3xl xl:text-4xl font-bold ${getValueColor()}`}
        >
          {value.toLocaleString()}
        </span>
      </CardContent>
    </Card>
  );
}
