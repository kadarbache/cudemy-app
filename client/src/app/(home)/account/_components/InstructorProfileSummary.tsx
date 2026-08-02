import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InstructorRegistration } from "@/util/interfaces";

// read only for now, the edit button comes later
export default function InstructorProfileSummary({
  instructor,
}: {
  instructor: InstructorRegistration;
}) {
  return (
    <div className="mx-auto max-w-3xl py-10">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-balance">
          Your Instructor Profile
        </h2>
        <p className="mt-2 text-muted-foreground text-pretty">
          This is the information you registered with
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Instructor Application Summary</CardTitle>
          <CardDescription>
            The details currently saved on your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Occupation Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Occupation
            </h3>
            <div className="flex flex-wrap gap-2">
              {instructor.expertise.map((occ, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {occ}
                </Badge>
              ))}
            </div>
          </div>

          <div className="border-t" />

          {/* Specific Skills Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Specific Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {instructor.specificSkillsToTeach.map((skill, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="border-t" />

          {/* Years of Expertise Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Years of Expertise
            </h3>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 px-4 py-2">
                <span className="text-2xl font-bold text-primary">
                  {instructor.yearsOfExperience}
                </span>
                <span className="ml-2 text-sm text-muted-foreground">
                  {instructor.yearsOfExperience === 1 ? "year" : "years"}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t" />

          {/* Qualifications Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Qualifications
            </h3>
            <ul className="space-y-2">
              {instructor.qualifications.map((qual, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">✓</span>
                  <span className="text-sm">{qual}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t" />

          {/* Bio Section */}
          {instructor.instructorBio && (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Bio
                </h3>
                <p className="text-sm leading-relaxed">
                  {instructor.instructorBio}
                </p>
              </div>
              <div className="border-t" />
            </>
          )}

          {/* Sample Content URL Section */}
          {instructor.sampleContentUrl && (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Sample Content
                </h3>
                <a
                  href={instructor.sampleContentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                >
                  View Sample Content →
                </a>
              </div>
              <div className="border-t" />
            </>
          )}

          {/* Confirmations Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Confirmations
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <span
                  className={
                    instructor.guidelinesReviewed
                      ? "text-green-600"
                      : "text-destructive"
                  }
                >
                  {instructor.guidelinesReviewed ? "✓" : "✗"}
                </span>
                <div>
                  <p className="text-sm font-medium">Terms and Conditions</p>
                  <p className="text-xs text-muted-foreground">
                    {instructor.guidelinesReviewed ? "Accepted" : "Not accepted"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border p-4">
                <span
                  className={
                    instructor.hasEquipment
                      ? "text-green-600"
                      : "text-destructive"
                  }
                >
                  {instructor.hasEquipment ? "✓" : "✗"}
                </span>
                <div>
                  <p className="text-sm font-medium">Equipment Availability</p>
                  <p className="text-xs text-muted-foreground">
                    {instructor.hasEquipment
                      ? "Has necessary equipment"
                      : "Does not have necessary equipment"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
