import React from "react";
import { tokens } from "../lib/tokens";
import type { CreativeBrief } from "../lib/schemas";

export function HeroImage({ brief }: { brief: CreativeBrief }) {
  const { props, size } = brief;
  const dimensions = tokens.sizes.ad[size];
  const colors = props.colorOverrides ?? {};
  const bgColor = colors.background ?? tokens.colors.navy;
  const headlineColor = colors.headlineColor ?? tokens.colors.gold;
  const ctaBg = colors.ctaBackground ?? tokens.colors.ruby;
  const ctaColor = colors.ctaColor ?? tokens.colors.white;

  const isVertical = dimensions.height > dimensions.width;
  const imageHeight = Math.round(dimensions.height * 0.55);
  const contentHeight = dimensions.height - imageHeight;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: bgColor,
      }}
    >
      <div
        style={{
          display: "flex",
          width: dimensions.width,
          height: imageHeight,
          background: props.backgroundImage
            ? undefined
            : `linear-gradient(135deg, ${tokens.colors.navyLight} 0%, ${tokens.colors.navy} 50%, ${tokens.colors.goldDark} 100%)`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {props.backgroundImage ? (
          <img
            src={props.backgroundImage}
            style={{ width: dimensions.width, height: imageHeight, objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              fontSize: 48,
              color: tokens.colors.goldLight,
              fontFamily: "Playfair Display",
              opacity: 0.3,
            }}
          >
            LUCKY LINE
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: contentHeight,
          padding: tokens.spacing["2xl"],
          gap: isVertical ? tokens.spacing.xl : tokens.spacing.lg,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Playfair Display",
            fontSize: isVertical ? 56 : 44,
            fontWeight: 700,
            color: headlineColor,
            textAlign: "center",
            lineHeight: 1.2,
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
            fontSize: isVertical ? 28 : 22,
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
