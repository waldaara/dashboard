import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";

export interface IndicadorProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const Indicador = ({ title, description, icon }: IndicadorProps) => {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="font-bold text-3xl">{title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          {icon}
          <span>{description}</span>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
