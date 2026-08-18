export const ORDER_STAGES = [
  { id: "ordered", label: "Ordered", blurb: "We've got your order and it's confirmed." },
  { id: "shipped", label: "Shipped", blurb: "Your parcel has left us and is on the way." },
  { id: "out_for_delivery", label: "Out for delivery", blurb: "It's with the courier for delivery today." },
  { id: "delivered", label: "Delivered", blurb: "Handed over. We hope your beagle approves." },
] as const;

export const PICKUP_STAGE = {
  id: "ready_to_collect",
  label: "Ready to collect",
  blurb: "You can come and collect it from us — email us to fix a time.",
} as const;

export type OrderStage = (typeof ORDER_STAGES)[number]["id"] | typeof PICKUP_STAGE.id;

export const ALL_STAGES = [...ORDER_STAGES, PICKUP_STAGE];

export const stageMeta = (id: string | null | undefined) =>
  ALL_STAGES.find((s) => s.id === id) ?? null;

export const stageIndex = (id: string | null | undefined) =>
  ORDER_STAGES.findIndex((s) => s.id === id);
