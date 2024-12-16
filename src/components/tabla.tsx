import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";

export interface Item {
  dateStart: string | null;
  dateEnd: string | null;
  precipitation: string | null;
  humidity: string | null;
  clouds: string | null;
}

export interface TablaProps {
  items: Item[];
}

export const Tabla = ({ items }: TablaProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Hora de inicio</TableHead>
          <TableHead>Hora de fin</TableHead>
          <TableHead>Precipitación</TableHead>
          <TableHead>Humedad</TableHead>
          <TableHead>Nubosidad</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.dateStart}>
            <TableCell>
              {new Date(item.dateStart!).toLocaleTimeString()}
            </TableCell>
            <TableCell>
              {new Date(item.dateEnd!).toLocaleTimeString()}
            </TableCell>
            <TableCell>{item.precipitation}</TableCell>
            <TableCell>{item.humidity}</TableCell>
            <TableCell>{item.clouds}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
