import { HoverEffect } from "../ui/hoverEffect";


export function CardHoverEffect() {
  return (
    <div className="max-w-7xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}

export const projects = [
    {
      title: "GP Appointment",
      description: "Book an appointment for 70dt.",
      link: "#",
    },
    {
      title: "Hair Loss Perscription",
      description: "Get a prescription for hair loss treatment for 70dt.",
      link: "#",
    },
    {
      title: "Health Video Consultation",
      description: "Have a video consultation with a healthcare professional for 70dt.",
      link: "#",
    },
    {
      title: "Man's Health consultation",
      description: "Consultation specifically tailored to men's health for 70dt.",
      link: "#",
    },
    {
      title: "Medicine Prescription",
      description: "Obtain a prescription for medicine for 70dt.",
      link: "#",
    },
    {
      title: "Fit Note Video Consultation",
      description: "Receive a video consultation to get a fit note for 70dt.",
      link: "#",
    },
  ];
  
