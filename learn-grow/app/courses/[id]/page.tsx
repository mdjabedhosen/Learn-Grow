import CourseDetails from "@/components/courses/CourseDetails";
import { Metadata } from "next";

interface Props {
    params: {
        id: string;
    };
}

// Dynamic/SSR route - not using static generation since courses come from API
import { courses, findCourseDetail } from "@/lib/coursesData";

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const course = findCourseDetail(params.id);
  
  if (!course) {
    const isPython = params.id.toLowerCase().includes("python");
    const isRobotics = params.id.toLowerCase().includes("robot");
    const fallbackTitle = isPython 
      ? "Python Programming for Teens - Learn & Grow" 
      : isRobotics 
      ? "Junior Robotics with Arduino - Learn & Grow" 
      : "Course Details - Learn & Grow";

    return {
      title: fallbackTitle,
      description: "Master real-world STEM skills with 1-on-1 live mentoring, hands-on projects, and verifiable certification at Learn & Grow.",
    };
  }

  const title = course.en?.title || "STEM & Coding Course";
  const description = course.en?.overview || course.en?.tagline || "Learn hands-on STEM and coding with expert live mentors at Learn & Grow.";
  const courseUrl = `https://learnandgrow.io/courses/${course.slug || params.id}`;
  const imageUrl = "https://learnandgrow.io/og-courses.jpg";

  return {
    title: `${title} - Learn & Grow STEM Academy`,
    description,
    keywords: [
      title,
      "robotics course",
      "Python programming for kids",
      "STEM education Bangladesh",
      "Arduino robotics",
      "online live classes",
      "coding bootcamp for teens",
      course.category || "technology",
    ],
    authors: [{ name: "Learn & Grow Academy" }],
    openGraph: {
      title: `${title} - Learn & Grow`,
      description,
      url: courseUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - Learn & Grow`,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: courseUrl,
    },
  };
}

export function generateStaticParams() {
    return [
      { id: "python-programming-for-teens" },
      { id: "junior-robotics" },
      { id: "69ce553ce9e96ed805295101" },
      { id: "69ca5603e9e96ed80529474a" },
    ];
}

// Mark page as dynamic to allow rendering of courses not in static params
export const dynamic = 'force-dynamic';

export default async function CourseDetailsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const course = findCourseDetail(params.id);

    // Generate JSON-LD structured data for the course
    const jsonLd = course ? {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": course.en?.title || "STEM Course",
      "description": course.en?.overview || "",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "Learn & Grow Academy",
        "url": "https://learnandgrow.io"
      },
      "url": `https://learnandgrow.io/courses/${params.id}`,
      "image": "https://learnandgrow.io/og-courses.jpg",
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online",
        "courseWorkload": course.duration || "8-10 weeks"
      },
      "offers": {
        "@type": "Offer",
        "price": "2999",
        "priceCurrency": "BDT",
        "availability": "https://schema.org/InStock",
        "url": `https://learnandgrow.io/courses/${params.id}`
      }
    } : null;

    return (
      <>
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        <CourseDetails courseId={params.id} />
      </>
    );
}
