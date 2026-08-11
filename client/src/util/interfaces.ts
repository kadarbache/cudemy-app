export type Role = "admin" | "instructor" | "student";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
  language: string;
}

export interface IInstructorProfile {
  expertise: string[];
  yearsOfExperience: number;
  instructorBio: string | null;
}

// the instructor's own registration record, everything they filled in
export interface InstructorRegistration {
  id: string;
  expertise: string[];
  specificSkillsToTeach: string[];
  yearsOfExperience: number;
  qualifications: string[];
  instructorBio: string | null;
  guidelinesReviewed: boolean;
  hasEquipment: boolean;
  sampleContentUrl: string | null;
}

export interface IInstructorStats {
  totalCourses: number;
  totalStudents: number;
}

export interface IInstructor {
  id: string;
  name: string;
  email: string;
  image: string;
  secret: string;
  roles: Role[];
  bio: string | null;
  emailVerified: boolean;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
  // only returned by the single course endpoint
  instructor?: IInstructorProfile | null;
}

export interface ICourse {
  id: string;
  title: string;
  description: string;
  secureUrl: string;
  publicId: string;
  duration: number;
  price: number;
  discount: number;
  level: string[];
  category: string[];
  instructorId: string;
  isPublished: boolean;
  numberOfLectures: number;
  totalOfHours: number;
  createdAt: string;
  updatedAt: string;
  instructor: IInstructor;
  modules?: Module[];
  isEnrolled?: boolean;
  rating?: number;
  instructorStats?: IInstructorStats;
  _count?: { students: number };
}

export interface IEnrolledCourse extends ICourse {
  entrolledAt: string;
}

export interface ICartItem {
  id: string;
  courseId: string;
  addedAt: string;
  course: ICourse;
}

export interface IWishlistItem {
  id: string;
  courseId: string;
  addedAt: string;
  course: ICourse;
}

export interface Lecture {
  id: string;
  title: string;
  description: string;
  duration: number;
  moduleId: string;
  instructorId?: string;
  isPreview: boolean;
  order: number;
  publicId?: string;
  secureUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  optional?: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  lectures: Lecture[];
}
