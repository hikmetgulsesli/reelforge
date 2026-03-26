// About page tests - basic rendering validation
// Note: Full component testing requires Next.js App Router test setup

import fs from "fs";
import path from "path";
import { describe, it, expect } from "@jest/globals";

describe("AboutPage", () => {
  it("about page file exists and exports default component", () => {
    const aboutPagePath = path.join(__dirname, "../about/page.tsx");
    expect(fs.existsSync(aboutPagePath)).toBe(true);
    
    // Verify it contains the expected sections
    const content = fs.readFileSync(aboutPagePath, "utf-8");
    expect(content).toContain("AboutPage");
    expect(content).toContain("HeroSection");
    expect(content).toContain("ExperienceTimeline");
    expect(content).toContain("SkillsGrid");
    expect(content).toContain("CVDownloadButton");
  });

  it("about page contains all required UI elements", () => {
    const aboutPagePath = path.join(__dirname, "../about/page.tsx");
    const content = fs.readFileSync(aboutPagePath, "utf-8");
    
    // Hero section elements
    expect(content).toContain("ReelForge Team");
    expect(content).toContain("AI-Powered Video Generation Platform");
    
    // Experience section
    expect(content).toContain("Experience");
    expect(content).toContain("Senior Full-Stack Developer");
    expect(content).toContain("Full-Stack Developer");
    expect(content).toContain("Frontend Developer");
    expect(content).toContain("Junior Developer");
    
    // Skills section
    expect(content).toContain("Skills");
    expect(content).toContain("Frontend");
    expect(content).toContain("Backend");
    expect(content).toContain("Database");
    expect(content).toContain("DevOps");
    expect(content).toContain("Tools");
    expect(content).toContain("Soft Skills");
    
    // CV download button
    expect(content).toContain("Download CV");
  });

  it("about page has proper Next.js client directive", () => {
    const aboutPagePath = path.join(__dirname, "../about/page.tsx");
    const content = fs.readFileSync(aboutPagePath, "utf-8");
    
    expect(content).toContain('"use client"');
  });

  it("about page uses design tokens from CSS variables", () => {
    const aboutPagePath = path.join(__dirname, "../about/page.tsx");
    const content = fs.readFileSync(aboutPagePath, "utf-8");
    
    // Should use CSS variables for theming
    expect(content).toContain("var(--color-primary)");
    expect(content).toContain("var(--color-secondary)");
    expect(content).toContain("var(--font-display)");
    expect(content).toContain("var(--text-main)");
    expect(content).toContain("var(--text-muted)");
  });

  it("about page implements scroll animations with IntersectionObserver", () => {
    const aboutPagePath = path.join(__dirname, "../about/page.tsx");
    const content = fs.readFileSync(aboutPagePath, "utf-8");
    
    expect(content).toContain("IntersectionObserver");
    expect(content).toContain("translateY");
    expect(content).toContain("translateX");
    expect(content).toContain("opacity");
  });

  it("about page has avatar with circular styling", () => {
    const aboutPagePath = path.join(__dirname, "../about/page.tsx");
    const content = fs.readFileSync(aboutPagePath, "utf-8");
    
    // Avatar should be 200px circular with border
    expect(content).toContain("width: 200");
    expect(content).toContain("height: 200");
    // borderRadius in JSX uses camelCase with string value
    expect(content).toContain('borderRadius: "50%"');
    expect(content).toContain("border: \"4px solid");
    expect(content).toContain("var(--color-primary)");
  });

  it("about page has responsive design styles in globals.css", () => {
    const globalsPath = path.join(__dirname, "../../app/globals.css");
    const content = fs.readFileSync(globalsPath, "utf-8");
    
    // Should have about page specific styles
    expect(content).toContain("about-avatar-inner");
    expect(content).toContain("about-gradient-text");
    expect(content).toContain("about-timeline-card");
    expect(content).toContain("about-skill-card");
  });
});
