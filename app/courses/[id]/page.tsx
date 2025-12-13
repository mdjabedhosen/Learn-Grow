import CourseDetails from "@/components/courses/CourseDetails";

interface Props {
    params: {
        id: string;
    };
}

// Dynamic/SSR route now
// export function generateStaticParams() { ... }

export default function CourseDetailsPage({ params }: Props) {
    return <CourseDetails courseId={params.id} />;
}
