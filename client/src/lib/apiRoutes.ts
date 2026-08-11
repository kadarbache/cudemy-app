const API_BASE_URL = process.env.SERVER_URL;

if (!API_BASE_URL) {
  // This will cause a build-time error if the env var is not set.
  throw new Error("Missing required environment variable: SERVER_URL");
}

export const apiRoutes = {
  auth: {
    signUpEmail: `${API_BASE_URL}/auth/sign-up/email`,
    signInEmail: `${API_BASE_URL}/auth/sign-in/email`,
    signOut: `${API_BASE_URL}/auth/sign-out`,
  },
  user: {
    getUserSession: `${API_BASE_URL}/user`,
    updateProfile: `${API_BASE_URL}/user/updateprofile`,
    changepassword: `${API_BASE_URL}/user/changepassword`,
    updateProfileImage: `${API_BASE_URL}/user/updateprofilepicture`,
  },
  courses: {
    getAllCourses: `${API_BASE_URL}/course`,
    searchCourses: (query: string) =>
      `${API_BASE_URL}/course?search=${encodeURIComponent(query)}`,
    getCourseById: (id: string) => `${API_BASE_URL}/course/${id}`,
    getCourseEnrollment: (id: string) =>
      `${API_BASE_URL}/course/${id}/enrollment`,
    createCourse: `${API_BASE_URL}/course/newcourse`,
    getYourCourses: `${API_BASE_URL}/course/yourcourses`,
    getEnrolledCourses: `${API_BASE_URL}/course/enrolled`,
    deleteCourse: `${API_BASE_URL}/course/deletecourse`,
    updateCourse: (id: string) => `${API_BASE_URL}/course/updatecourse/${id}`,
    enrollCourse: (id: string) => `${API_BASE_URL}/course/enroll/${id}`,
  },
  cart: {
    getCart: `${API_BASE_URL}/course/cart`,
    addToCart: (id: string) => `${API_BASE_URL}/course/cart/${id}`,
    removeFromCart: (id: string) => `${API_BASE_URL}/course/cart/${id}`,
  },
  wishlist: {
    getWishlist: `${API_BASE_URL}/course/wishlist`,
    addToWishlist: (id: string) => `${API_BASE_URL}/course/wishlist/${id}`,
    removeFromWishlist: (id: string) => `${API_BASE_URL}/course/wishlist/${id}`,
  },
  module: {
    createModule: `${API_BASE_URL}/course/newmodule`,
    updateModule: `${API_BASE_URL}/course/updatemodule`,
    deleteModule: `${API_BASE_URL}/course/deleteModule`,
    reorderModules: `${API_BASE_URL}/course/reordermodules`,
  },
  lectures: {
    createLecture: `${API_BASE_URL}/course/newlecture`,
    updateLecture: `${API_BASE_URL}/course/updatelecture`,
    reorderLectures: `${API_BASE_URL}/course/reorderlectures`,
  },
  instructor: {
    registerInstructor: `${API_BASE_URL}/instructor/register`,
    getInstructorProfile: `${API_BASE_URL}/instructor/me`,
  },
};
