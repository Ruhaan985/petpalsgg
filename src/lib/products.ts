import productHandbook from "@/assets/product-handbook.jpg";
import productBowl from "@/assets/product-bowl.jpg";
import productLeash from "@/assets/product-leash.jpg";
import { BookOpen, Utensils, MapPin } from "lucide-react";

export const PRODUCTS = [
  {
    id: "handbook",
    name: "PetPals Handbook",
    tagline: "A quiet guide to a happy pet.",
    body: "A hand-bound care handbook covering nutrition, routines, gentle training and first-aid — written for new pet parents by students who obsess over the small details.",
    image: productHandbook,
    icon: BookOpen,
    meta: ["148 pages", "Linen hardcover", "Illustrated"],
    details: [
      "Ten chapters covering the first year of life together.",
      "Illustrated in soft duotone by the design student on the team.",
      "Printed on uncoated recycled stock, hand-bound in linen.",
    ],
  },
  {
    id: "bowl",
    name: "Safe Eating Bowl",
    tagline: "Portion patrol, quietly.",
    body: "A wooden scale-base that senses portion weight and glows soft green when the meal is just right. No app, no noise — just healthier feeding, one bowl at a time.",
    image: productBowl,
    icon: Utensils,
    meta: ["USB-C", "Fits any bowl", "Silent LED cue"],
    details: [
      "Weighs each meal to within a gram, silently.",
      "Soft LED ring — green for a right-sized portion, amber for too much.",
      "USB-C charge lasts roughly six weeks of daily use.",
    ],
  },
  {
    id: "leash",
    name: "GPS Tracker Leash",
    tagline: "Every walk, quietly mapped.",
    body: "A soft leather leash with a discreet GPS puck stitched into the handle — live location, safe-zone alerts and a two-week battery, so a wandering beagle is never really lost.",
    image: productLeash,
    icon: MapPin,
    meta: ["Live GPS", "14-day battery", "Safe-zone alerts", "Weatherproof"],
    details: [
      "Live GPS with a soft handle-tap when your beagle leaves a safe zone.",
      "Two-week battery on a single charge; weatherproof stitching.",
      "Discreet — no glowing screens, no chirps, no monthly fees.",
    ],
  },
] as const;

export type ProductId = (typeof PRODUCTS)[number]["id"];

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);
