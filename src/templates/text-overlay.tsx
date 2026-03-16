import React from "react";
import { tokens } from "@bordo/ui";
import type { CreativeBrief } from "@bordo/ad-insights";

export function TextOverlay({ brief }: { brief: CreativeBrief }) {
  const { props, size } = brief;
  const dimensions = tokens.sizes.ad[size];
  const colors = props.colorOverrides ?? {};
  const headlineColor = colors.headlineColor ?? tokens.colors.white;
  const ctaBg = colors.ctaBackground ?? tokens.colors.gold;
  const ctaColor = colors.ctaColor ?? tokens.colors.navy;

  const isVertical = dimensions.height > dimensions.width;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: dimensions.width,
        height: dimensions.height,
        position: "relative",
      }}
    >
      {/* Background */}
      {props.backgroundImage ? (
        <img
          src={props.backgroundImage}
          style={{
            position: "absolute",
            width: dimensions.width,
            height: dimensions.height,
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            display: "flex",
            position: "absolute",
            width: dimensions.width,
            height: dimensions.height,
            background: `linear-gradient(180deg, ${tokens.colors.navy} 0%, ${tokens.colors.navyLight} 40%, ${tokens.colors.goldDark} 100%)`,
          }}
        />
      )}

      {/* Dark overlay for readability */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          width: dimensions.width,
          height: dimensions.height,
          backgroundColor: "rgba(0, 0, 0, 0.45)",
        }}
      />

      {/* Text content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: isVertical ? tokens.spacing.xl : tokens.spacing.lg,
          padding: tokens.spacing["3xl"],
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Playfair Display",
            fontSize: isVertical ? 64 : 52,
            fontWeight: 700,
            color: headlineColor,
            textAlign: "center",
            lineHeight: 1.15,
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          {props.headline}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: ctaBg,
            color: ctaColor,
            fontFamily: "Inter",
            fontWeight: 700,
            fontSize: isVertical ? 30 : 24,
            padding: `${tokens.spacing.md} ${tokens.spacing["2xl"]}`,
            borderRadius: tokens.borderRadius.full,
          }}
        >
          {props.cta}
        </div>
      </div>
    </div>
  );
}
