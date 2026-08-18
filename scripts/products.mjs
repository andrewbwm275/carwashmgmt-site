/** Chemical product catalog — slugs match legacy Base44 ChemicalProduct routes */
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[–—]/g, ' ')
    .replace(/:/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const IMG =
  'https://media.base44.com/images/public/699f163455fdaf19c59586b8/20e310582_image.png';

function scalePrice(p5, mult) {
  if (p5 == null) return null;
  return Math.round(p5 * mult * 100) / 100;
}

function product(name, category, tagline, price5) {
  const slug = slugify(name);
  return {
    name,
    slug,
    category,
    tagline,
    description: `${tagline} Formulated for professional tunnel and in-bay operations with consistent dilution and reliable performance.`,
    image: IMG,
    prices: {
      '5 GAL': price5,
      '15 GAL': scalePrice(price5, 2.7),
      '30 GAL': scalePrice(price5, 5.0),
      '55 GAL': null,
    },
    features: [
      'Professional-grade formulation for high-volume washes',
      'Compatible with standard injection and foam systems',
      'Optimized dilution ratios to control cost per car',
      'Backed by Car Wash Services technical support',
    ],
    applicationTypes: [category, 'Tunnel', 'Express'],
    usage: 'Follow manufacturer dilution guidelines for your water quality and equipment setup.',
    bestFor: `Operators seeking reliable ${category.toLowerCase()} performance with predictable chemical spend.`,
  };
}

export const products = [
  product('High pH Advanced Presoak', 'Presoak', 'Second step advanced presoak for superior vehicle cleaning.', 202.71),
  product('High pH Intermediate Presoak', 'Presoak', 'One step advanced presoak for an extra level of cleaning.', 425.78),
  product('High pH Basic Presoak', 'Presoak', 'One step advanced presoak for versatile, multi-system use.', 123.91),
  product('Low pH Advanced Presoak', 'Presoak', 'First step advanced presoak — recommended for two-step systems.', 192.25),
  product('Low pH Intermediate Presoak', 'Presoak', 'First step intermediate presoak with unique acid and surfactant blend.', 205.13),
  product('Low pH Basic Presoak', 'Presoak', 'One step, low pH presoak based on a non-HF acid.', 141.42),
  product('Neutral pH Presoak', 'Presoak', 'Safe, neutral pH presoak for general-purpose cleaning.', 155.4),
  product('Neutral Triple Foam: Blue', 'Triple Foam', 'Neutral blue tri-foam detergent for color and foam systems.', 99.33),
  product('Neutral Triple Foam: Green', 'Triple Foam', 'Neutral green tri-foam detergent for color and foam systems.', 99.33),
  product('Neutral Triple Foam: Red', 'Triple Foam', 'Neutral red tri-foam detergent for color and foam systems.', 99.33),
  product('Neutral Triple Foam: Yellow', 'Triple Foam', 'Neutral yellow tri-foam detergent for color and foam systems.', 99.33),
  product('Neutral Triple Foam: White', 'Triple Foam', 'Neutral white tri-foam detergent — clean and professional.', 99.33),
  product('Acid Wheel Cleaner', 'Wheel & Tire', 'Premium no-scrub wheel and tire cleaner — economical and advanced.', null),
  product('Non-Acid Wheel Cleaner', 'Wheel & Tire', 'Premium no-acid wheel and tire cleaner — safe and advanced.', 443.52),
  product('Tire Shine – Solvent Based', 'Wheel & Tire', 'Premium solvent-based tire shine with durable long-lasting gloss.', 328.16),
  product('Tire Shine – Water Based', 'Wheel & Tire', 'Premium water-based tire shine with durable long-lasting finish.', 273.46),
  product('Foaming Sealant', 'Protectants', 'High gloss surface protectant with total vehicle surface protection.', 307.13),
  product('Ceramic', 'Protectants', 'Ceramic barrier protectant designed with ceramic technology.', 322.12),
  product('Carnauba Wax', 'Protectants', 'Versatile Carnauba wax — high foaming and high water shedding.', 309.17),
  product('Graphene', 'Protectants', 'Powerful water repelling technology with next-gen Graphene.', 376.88),
  product('Drying Agent', 'Finishing', 'Powerful water repelling technology for extreme beading and sheeting.', 141.04),
  product('Glass Cleaner', 'Cleaning', 'Multi-purpose, ammonia-free glass cleaner for crystal-clear results.', 89.4),
  product('Wrap Lube', 'Cleaning', 'High-foaming brush system lubrication for vinyl wraps and all surfaces.', 99.33),
  product('Wall Cleaner', 'Cleaning', 'Powerful, acid-based no-scrub wall cleaner for car wash bays.', 267.62),
  product('Towel Soap', 'Cleaning', 'All purpose, economy, fabric-safe presoak for towels and fabrics.', 89.4),
];
