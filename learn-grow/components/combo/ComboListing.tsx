"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Badge,
  Image,
  Spinner,
} from "@nextui-org/react";
import Link from "next/link";
import { useGetActiveCombosQuery } from "@/redux/api/comboApi";
import { getDurationLabel } from "@/lib/access-control";
import { ICombo } from "@/types/combo.types";
import { BookOpen } from "lucide-react";

export default function ComboListing() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetActiveCombosQuery({
    page,
    limit: 9,
  });

  const combos = data?.data || [];
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Loading combos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-danger text-lg">Failed to load combos</p>
      </div>
    );
  }

  if (combos.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">No combos available yet</p>
      </div>
    );
  }

  const resolveBannerImage = (imgUrl?: string, title?: string): string => {
    if (
      !imgUrl ||
      imgUrl.includes("gemini.google.com") ||
      imgUrl.includes("course-69ca5603e9e96ed80529474a") ||
      imgUrl.includes("daq7v0wmf/image/upload")
    ) {
      const lower = (title || "").toLowerCase();
      if (lower.includes("python") || lower.includes("পাইথন")) {
        return "/courses/python-course-banner.jpg";
      }
      return "/courses/robotics-course-banner.jpg";
    }

    const lower = (title || "").toLowerCase();
    if (
      lower.includes("robotics") ||
      lower.includes("রোবটিক্স") ||
      lower.includes("arduino") ||
      lower.includes("আর্ডুইনো")
    ) {
      return "/courses/robotics-course-banner.jpg";
    }

    return imgUrl;
  };

  return (
    <div className="w-full">
      {/* Combos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {combos.map((combo: ICombo) => {
          const titles = combo.courses.map((c: any, i: number) =>
            typeof c === "string" ? `Course ${i + 1}` : c?.title || `Course ${i + 1}`
          );
          const displayTitles = titles.slice(0, 3).join(" • ");
          const extraCount = titles.length > 3 ? titles.length - 3 : 0;
          const thumbnailSrc = resolveBannerImage(combo.thumbnail, combo.name);

          return (
            <Card
              key={combo._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-default-200"
            >
              {/* Thumbnail with gradient overlay */}
              <CardHeader className="p-0">
                <div className="relative w-full h-40 overflow-hidden rounded-t-xl">
                  {thumbnailSrc ? (
                    <Image
                      src={thumbnailSrc}
                      alt={combo.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white text-lg font-bold drop-shadow-sm">
                      {combo.name}
                    </h3>
                    {combo.description && (
                      <p className="text-white/90 text-xs line-clamp-2">
                        {combo.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>

              {/* Content */}
              <CardBody className="space-y-4">
                {/* Included Courses */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Includes {titles.length} Courses
                  </p>
                  <p className="text-xs text-default-600 line-clamp-1">
                    {displayTitles}
                    {extraCount > 0 && (
                      <span className="text-default-500"> {` +${extraCount} more`}</span>
                    )}
                  </p>
                </div>

                {/* Access Duration */}
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    combo.duration === "lifetime"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${combo.duration === "lifetime" ? "bg-emerald-500" : "bg-blue-500"}`} />
                    {combo.duration === "lifetime" ? "Lifetime Access" : `${getDurationLabel(combo.duration)} Access`}
                  </span>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-2">
                  {combo.discountPrice && (
                    <span className="text-sm line-through text-default-400">
                      ৳{combo.price.toLocaleString()}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-success">
                    ৳{(combo.discountPrice || combo.price).toLocaleString()}
                  </span>
                </div>
              </CardBody>

              {/* Footer - CTA */}
              <CardFooter className="gap-2">
                <Button
                  as={Link}
                  href={`/checkout?plan=combo&comboId=${combo._id}`}
                  color="success"
                  className="hover:opacity-95 active:scale-95"
                  fullWidth
                >
                  Buy Now
                </Button>
                <Button
                  as={Link}
                  href={`/bundle/${combo._id}`}
                  color="primary"
                  variant="bordered"
                  className="hover:opacity-95 active:scale-95"
                  fullWidth
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            isDisabled={page === 1}
            onClick={() => setPage(page - 1)}
            variant="bordered"
          >
            Previous
          </Button>

          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              isIconOnly
              color={page === p ? "primary" : "default"}
              variant={page === p ? "solid" : "bordered"}
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}

          <Button
            isDisabled={page === pagination.pages}
            onClick={() => setPage(page + 1)}
            variant="bordered"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
