import { ICourse } from "@/util/interfaces";
import { Book, Clock, TrendingUp, Users } from "lucide-react";

export default function Status({ courses }: { courses: ICourse[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 border-b border-border bg-card/50 p-6 md:grid-cols-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-3">
          <Book className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Courses</p>
          <p className="text-2xl font-bold text-foreground">{courses.length}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-blue-500/10 p-3">
          <Users className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Students</p>
          <p className="text-2xl font-bold text-foreground">
            {/* {courses.reduce((sum, c) => sum + c.students, 0)} // each course will have  students array */}
            0
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-green-500/10 p-3">
          <Clock className="h-6 w-6 text-green-500" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Avg Duration</p>
          <p className="text-2xl font-bold text-foreground">8 weeks</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-purple-500/10 p-3">
          <TrendingUp className="h-6 w-6 text-purple-500" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Completion Rate</p>
          <p className="text-2xl font-bold text-foreground">92%</p>
        </div>
      </div>
    </div>
  );
}
