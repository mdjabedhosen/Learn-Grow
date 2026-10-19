"use client";

import React, { useMemo } from "react";
import { Spinner } from "@nextui-org/react";
import TeamClient from "@/components/TeamClient";
import { useGetAllTeamMembersQuery } from "@/redux/api/teamApi";

export default function TeamPage() {
    const { data: teamData, isLoading: teamLoading } = useGetAllTeamMembersQuery({});

    // Organize team members by role/category
    const organizedTeam = useMemo(() => {
        if (!teamData?.data || !Array.isArray(teamData.data)) {
            return { hero: {}, leadership: { cLevel: [], teamLeads: [] }, instructors: [], executives: [] };
        }

        const leadership = { cLevel: [], teamLeads: [] };
        const instructors = [];
        const executives = [];

        const seenNames = new Set<string>();

        // Sort members by position
        const sortedMembers = [...teamData.data].sort((a: any, b: any) => (a.position || 0) - (b.position || 0));

        sortedMembers.forEach((member: any) => {
            const normName = (member.name || "").trim().toLowerCase();
            if (seenNames.has(normName)) return; // Prevent duplicate display across sections
            seenNames.add(normName);

            const teamMember = {
                _id: member._id,
                image: member.image,
                name: member.name,
                role: (member.role?.toLowerCase() === "ceo" || normName.includes("jabed")) ? "Founder & CEO" : member.role,
                domain: member.domain,
                yearsOfExperience: member.yearsOfExperience,
                expertise: member.expertise,
                bio: member.bio,
                linkedIn: member.linkedIn,
                twitter: member.twitter,
                showOnHome: member.showOnHome,
                position: member.position,
            };

            const roleLower = (member.role || "").toLowerCase();

            // Categorize with Leadership priority first
            // Section 1: C-Level Leadership (CEO, CTO, COO, Founder)
            if (/\b(ceo|cto|coo|cfo|cmo|founder|co-founder|chief executive|chief technology|chief operating)\b/i.test(roleLower)) {
                leadership.cLevel.push(teamMember);
            }
            // Section 2: Team Leads, Managers & Coordinators
            else if (/\b(manager|lead|head|director|coordinator|supervisor|specialist)\b/i.test(roleLower)) {
                leadership.teamLeads.push(teamMember);
            }
            // Section 3: Instructors & Educators
            else if (/\b(instructor|teacher|educator|trainer|mentor|faculty)\b/i.test(roleLower)) {
                instructors.push(teamMember);
            }
            // Section 4: Core Team & Executives
            else {
                executives.push(teamMember);
            }
        });

        // Sort C-Level: CEO roles first, then CTO, then COO
        leadership.cLevel.sort((a: any, b: any) => {
            const aRole = (a.role || "").toLowerCase();
            const bRole = (b.role || "").toLowerCase();
            
            // CEO priority (1)
            if (/\bceo\b/i.test(aRole) && !/\bceo\b/i.test(bRole)) return -1;
            if (!/\bceo\b/i.test(aRole) && /\bceo\b/i.test(bRole)) return 1;
            
            // CTO priority (2)
            if (/\bcto\b/i.test(aRole) && !/\bcto\b/i.test(bRole)) return -1;
            if (!/\bcto\b/i.test(aRole) && /\bcto\b/i.test(bRole)) return 1;
            
            // COO priority (3)
            if (/\bcoo\b/i.test(aRole) && !/\bcoo\b/i.test(bRole)) return -1;
            if (!/\bcoo\b/i.test(aRole) && /\bcoo\b/i.test(bRole)) return 1;
            
            return 0;
        });

        return {
            hero: {
                tag: "Our Team",
                title: "Meet Our Experts",
                subtitle: "A talented team dedicated to transforming education",
            },
            leadership,
            instructors,
            executives,
        };
    }, [teamData]);

    if (teamLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" label="Loading team members..." color="primary" />
            </div>
        );
    }

    return <TeamClient content={organizedTeam} />;
}
