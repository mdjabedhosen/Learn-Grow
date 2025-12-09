"use client";
import React from "react";
import { Card, CardBody, Image } from "@nextui-org/react";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-6 py-12 max-w-6xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    About Learn & Grow
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Empowering the next generation of innovators through world-class STEM education.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                <div>
                    <Image
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
                        alt="Team working together"
                        className="rounded-2xl shadow-2xl"
                    />
                </div>
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        At Learn & Grow, we believe that education is the key to unlocking human potential.
                        Our mission is to make high-quality STEM education accessible, engaging, and relevant
                        for students of all ages. We combine cutting-edge technology with expert pedagogy
                        to create learning experiences that inspire curiosity and foster creativity.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Whether it's coding, robotics, or mathematics, our courses are designed to prepare
                        students for the challenges of tomorrow while sparking a lifelong love for learning today.
                    </p>
                </div>
            </div>

            <div className="mb-20">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Us?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Expert Instructors",
                            desc: "Learn from industry professionals and passionate educators who are leaders in their fields.",
                            icon: "👨‍🏫"
                        },
                        {
                            title: "Interactice Learning",
                            desc: "Hands-on projects, simulations, and gamified content make learning fun and effective.",
                            icon: "💻"
                        },
                        {
                            title: "Future Ready Skills",
                            desc: "Curriculum focused on high-demand skills like AI, Robotics, and Data Science.",
                            icon: "🚀"
                        }
                    ].map((item, index) => (
                        <Card key={index} className="p-6 hover:-translate-y-2 transition-transform duration-300">
                            <CardBody className="text-center">
                                <div className="text-5xl mb-4">{item.icon}</div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
