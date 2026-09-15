import React from "react";

export default function StatsPunctuation({ isAr }) {
  return (
    <section className="bg-brand-ink py-20 md:py-24 text-center">
      <div className="container mx-auto px-6">
        <p
          className="text-white font-normal text-2xl md:text-4xl max-w-4xl mx-auto leading-relaxed"
          style={{ fontFamily: "'Noto Naskh Arabic', 'Cairo', serif" }}
        >
          {isAr
            ? "منصة وطنية واحدة، توحّد جودة البحث العلمي، وتفتح الطريق نحو الاعتماد والتصنيف العالمي."
            : "One national platform, unifying research quality, and opening the path to global accreditation and ranking."}
        </p>

        <div className="w-16 h-0.5 bg-brand-orange mx-auto my-8" />

        <p className="text-sm text-gray-400 uppercase tracking-widest">
          {isAr
            ? "منصة سورس — نظام التميز البحثي الوطني"
            : "SOURCE Platform — National Research Excellence System"}
        </p>
      </div>
    </section>
  );
}
