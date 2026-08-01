'use client'
import Image from "next/image"
import { Users, BookOpen, Briefcase, GraduationCap } from "lucide-react"
import { useState } from "react"
import ShowMore from "./showMore"
import { IInstructor, IInstructorStats } from "@/util/interfaces"

const BIO_PREVIEW_LENGTH = 500

type InstructorProfileProps = {
  instructor?: IInstructor
  stats?: IInstructorStats
  courseStudents?: number
}

export default function InstructorProfile({ instructor, stats, courseStudents }: InstructorProfileProps) {
    const [showMore,setShowmore]=useState(false)

    if (!instructor) return null

    const profile = instructor.instructor
    const description = profile?.instructorBio || instructor.bio || ""
    const expertise = profile?.expertise?.length ? profile.expertise.join(", ") : "Instructor"
    const image =
      !instructor.image || instructor.image === "default.png" || instructor.image === "default.jpg"
        ? "/assets/default.png"
        : instructor.image

  return (
    <div className="py-6 px-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructors</h2>

      <div className="space-y-6">
        {/* Instructor Header */}
        <div>
          <h3 className="text-xl font-semibold text-primary mb-1">{instructor.name}</h3>
          <p className="text-foreground/70">{expertise}</p>
        </div>

        {/* Profile Section */}
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <Image
              src={image}
              alt={`${instructor.name} profile picture`}
              width={120}
              height={120}
              className="rounded-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <GraduationCap className="w-4 h-4" />
              <span>{(courseStudents ?? 0).toLocaleString()} Students in this course</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <Users className="w-4 h-4" />
              <span>{(stats?.totalStudents ?? 0).toLocaleString()} Students</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <BookOpen className="w-4 h-4" />
              <span>{(stats?.totalCourses ?? 0).toLocaleString()} Courses</span>
            </div>

            {profile?.yearsOfExperience ? (
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Briefcase className="w-4 h-4" />
                <span>{profile.yearsOfExperience} Years of experience</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Bio Section */}
        <div className="max-w-3xl space-y-4 text-sm text-foreground leading-relaxed">
            {description === "" ? (
              <p className="text-foreground/60">This instructor has not added a bio yet.</p>
            ) : showMore === false ? (
              <p>{description.slice(0,BIO_PREVIEW_LENGTH)}</p>
            ) : (
              <p>{description}</p>
            )}
        </div>

        {/* Show More Button */}
        {description.length > BIO_PREVIEW_LENGTH && (
          <ShowMore onHandleShowMore={setShowmore} showMore={showMore}/>
        )}
      </div>
    </div>
  )
}
