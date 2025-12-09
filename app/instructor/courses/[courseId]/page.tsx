import InstructorCourseDashboardClient from "./ClientPage";

// Hardcoded sample/main courses for static generation
const SAMPLE_COURSES = [
    {
        id: "1",
        title: "Web Development Bootcamp",
        description: "The complete guide to becoming a full-stack developer.",
        price: 2000,
        enrolled: 45,
        rating: 4.8,
        status: "published"
    },
    {
        id: "2",
        title: "Python for Kids",
        description: "A fun and interactive introduction to Python programming.",
        price: 1500,
        enrolled: 32,
        rating: 4.9,
        status: "published"
    },
    {
        id: "3",
        title: "Robotics Basics",
        description: "Learn the fundamentals of robotics and electronics.",
        price: 2500,
        enrolled: 18,
        rating: 4.7,
        status: "published"
    },
    {
        id: "4",
        title: "Game Development with Scratch",
        description: "Create your own games using Scratch visual programming.",
        price: 1200,
        enrolled: 60,
        rating: 4.9,
        status: "published"
    }
];

export function generateStaticParams() {
    return SAMPLE_COURSES.map(course => ({
        courseId: course.id
    }));
}

export default function InstructorCourseDashboard({ params }: { params: { courseId: string } }) {
    return <InstructorCourseDashboardClient params={params} />;
}
