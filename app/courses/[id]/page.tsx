import CourseDetails from "@/components/courses/CourseDetails";

interface Props {
    params: {
        id: string;
    };
}

export function generateStaticParams() {
    return [
        { id: "1" },
        { id: "2" },
        { id: "3" },
        { id: "SAMPLE" },
        { id: "65685d0d8269781845686868" }
    ];
}

export default function CourseDetailsPage({ params }: Props) {
    return <CourseDetails courseId={params.id} />;
}
