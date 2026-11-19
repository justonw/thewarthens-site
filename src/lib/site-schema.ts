// The facts about the site that every page shares, written once as structured data. Search engines use it to tie the
// site, the organization, and the two people together (and to match them to their other profiles). Pages refer to these
// by their @id. Only add facts here that are true and shown on the site.

export const SITE = "https://thewarthens.com";

export const socialLinks = {
  youtubeTech: "https://youtube.com/@thewarthens",
  youtubeFaith: "https://www.youtube.com/channel/UCJj_ar9Gs8YvcYK6jSh9a6g",
  instagram: "https://www.instagram.com/thewarthens",
  tiktok: "https://www.tiktok.com/@thewarthens",
  linkedinJuston: "https://www.linkedin.com/in/juston-warthen-96aa13167",
  linkedinAtiya: "https://www.linkedin.com/in/atiya-warthen-4062881b0",
};

export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "The Warthens",
      alternateName: ["Tech Journey", "Faith Journey with The Warthens"],
      description: "Real steps for a career change into tech, resume tools, and a faith journey of relying on God to discover, understand, and live out truth.",
      inLanguage: "en-US",
      publisher: { "@id": `${SITE}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "The Warthens",
      alternateName: ["Tech Journey", "The Warthens Tech Journey"],
      url: SITE,
      logo: { "@type": "ImageObject", url: `${SITE}/brand/icon-square.png`, width: 460, height: 460 },
      image: `${SITE}/opengraph-image`,
      email: "info@thewarthens.com",
      description: "Juston and Atiya Warthen, known as Tech Journey, share practical steps for a career change into tech, plus their journey of relying on God to discover, understand, and live out truth.",
      founder: [{ "@id": `${SITE}/about#juston` }, { "@id": `${SITE}/about#atiya` }],
      sameAs: Object.values(socialLinks),
      contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: "info@thewarthens.com", url: `${SITE}/contact` },
    },
    {
      "@type": "Person",
      "@id": `${SITE}/about#juston`,
      name: "Juston Warthen",
      url: `${SITE}/about`,
      image: `${SITE}/team/juston.jpg`,
      worksFor: { "@id": `${SITE}/#organization` },
      sameAs: [socialLinks.linkedinJuston],
    },
    {
      "@type": "Person",
      "@id": `${SITE}/about#atiya`,
      name: "Atiya Warthen",
      url: `${SITE}/about`,
      image: `${SITE}/team/atiya.png`,
      worksFor: { "@id": `${SITE}/#organization` },
      sameAs: [socialLinks.linkedinAtiya],
    },
  ],
};
