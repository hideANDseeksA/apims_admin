import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function LeaveTable({ data, loading, onEditClick, onDeleteClick }) {

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 space-y-4">

      {/* --- TOP SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {data.length}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Points</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {data.reduce((sum, item) => sum + Number(item.points), 0)}
          </CardContent>
        </Card>
      </div>

      {/* --- SCROLL AREA LIST --- */}
      <ScrollArea className="h-[500px] border rounded-lg p-2">
        <div className="space-y-3">
          {data.map((item) => (
            <Card key={item.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  
                  {/* LEFT INFO */}
                  <div>
                    <p className="font-semibold">
                      Employee ID: <span className="text-blue-600">{item.employee_id}</span>
                    </p>
                    <p>Points: {item.points}</p>
                    <p>Type: {item.types}</p>
                    <p>Status: {item.status}</p>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => onEditClick(item)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onDeleteClick(item.id)}
                    >
                      Delete
                    </Button>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
