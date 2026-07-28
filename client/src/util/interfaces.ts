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
}

export interface IEnrolledCourse extends ICourse {
  entrolledAt: string;
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
