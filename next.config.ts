import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default withLingo(nextConfig, {
  sourceRoot: ".",
  sourceLocale: "en",
  targetLocales: [
    "af", "am", "ar", "az", "be", "bg", "bn", "ca", "cs", "cy", "da", "de",
    "el", "es", "et", "eu", "fa", "fi", "fil", "fr", "ga", "gl", "gu", "he",
    "hi", "hr", "hu", "hy", "id", "is", "it", "ja", "ka", "kk", "km", "kn",
    "ko", "lo", "lt", "lv", "mk", "ml", "mn", "mr", "ms", "mt", "my", "nb",
    "ne", "nl", "no", "pa", "pl", "pt", "ro", "ru", "rw", "si", "sk", "sl",
    "sq", "sr", "sv", "sw", "ta", "te", "th", "ti", "tr", "uk", "ur", "uz",
    "vi", "zh", "zu"
  ],
});
