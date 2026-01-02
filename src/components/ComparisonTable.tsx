import { comparisonTable, courses } from "@/data/articleData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const ComparisonTable = () => {
  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return String(index + 1);
  };

  return (
    <section className="py-8 md:py-12">
      <div className="container max-w-4xl mx-auto">
        <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm overflow-x-auto">
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-6 flex items-center gap-2 border-l-4 border-primary pl-4">
            Отличительные преимущества каждого курса
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">№</TableHead>
                <TableHead>Название курса и школы</TableHead>
                <TableHead>Отличия</TableHead>
                <TableHead className="w-24">Ссылка</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonTable.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{getMedal(index)}</TableCell>
                  <TableCell>
                    <a
                      href={courses[index]?.url || "#"}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.name}
                    </a>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.differences}</TableCell>
                  <TableCell>
                    <a
                      href={courses[index]?.url || "#"}
                      className="text-primary hover:underline text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Перейти
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};
