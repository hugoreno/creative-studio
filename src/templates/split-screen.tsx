import React from "react";
import { tokens } from "@bordo/ui";
import type { CreativeBrief } from "@bordo/ad-insights";

export function SplitScreen({ brief }: { brief: CreativeBrief }) {
  const { props, size } = brief;
  const dimensions = tokens.sizes.ad[size];
  const colors = props.colorOverrides ?? {};
  const bgColor = colors.background ?? tokens.colors.navy;
  const headlineColor = colors.headlineColor ?? tokens.colors.gold;
  const ctaBg = colors.ctaBackground ?? tokens.colors.ruby;
  const ctaColor = colors.ctaColor ?? tokens.colors.white;

  const isVertical = dimensions.height > dimensions.width;
  // For vertical formats, stack instead of side-by-side
  const splitVertically = isVertical;

  const imageSize = splitVertically
    ? { width: dimensions.width, height: Math.round(dimensions.height * 0.5) }
    : { width: Math.round(dimensions.width * 0.5), height: dimensions.height };

  const textSize = splitVertically
    ? { width: dimensions.width, height: dimensions.height - imageSize.height }
    : { width: dimensions.width - imageSize.width, height: dimensions.height };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: splitVertically ? "column" : "row",
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: bgColor,
      }}
    >
      {/* Image half */}
      <div
        style={{
          display: "flex",
          width: imageSize.width,
          height: imageSize.height,
          alignItems: "center",
          justifyContent: "center",
          background: props.backgroundImage
            ? undefined
            : `linear-gradient(135deg, ${tokens.colors.goldDark} 0%, ${tokens.colors.navy} 100%)`,
        }}
      >
        {props.backgroundImage ? (
          <img
            src={props.backgroundImage}
            style={{
              width: imageSize.width,
              height: imageSize.height,
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              fontSize: 36,
              color: tokens.colors.goldLight,
              fontFamily: "Playfair Display",
              opacity: 0.3,
            }}
          >
            LUCKY LINE
          </div>
        )}
      </div>

      {/* Text half */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: textSize.width,
          height: textSize.height,
          padding: tokens.spacing.xl,
          gap: tokens.spacing.lg,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Playfair Display",
            fontSize: splitVertically ? 48 : 38,
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
            fontSize: splitVertically ? 26 : 20,
            padding: `${tokens.spacing.sm} ${tokens.spacing.xl}`,
            borderRadius: tokens.borderRadius.full,
          }}
        >
          {props.cta}
        </div>
      </div>
    </div>
  );
}
