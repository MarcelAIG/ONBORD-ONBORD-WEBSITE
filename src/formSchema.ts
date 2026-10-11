export type FieldType = 'input' | 'textarea' | 'radio' | 'checkbox' | 'file' | 'gallery';

export interface FormField {
  label: string;
  type: FieldType;
  placeholder?: string;
  helperText?: string;
  options?: string[]; // For radio and checkbox
  accept?: string;    // For file
  maxFiles?: number;  // For gallery
  condition?: { field: string; value: string };
  required?: boolean;
  requiredCondition?: { field: string; value: string };
}

export interface FormSection {
  title: string;
  description?: string;
  importantNotice?: string;
  fields: FormField[];
}

export const SECTIONS: FormSection[] = [
  {
    title: "1. Business Information",
    fields: [
      { label: "Contact Person", type: "input", placeholder: "Owner or manager name", helperText: "Name of the owner or main person we should contact if we have questions." },
      { label: "Business Name", type: "input", placeholder: "e.g. Lotus Thai Massage", required: true },
      { label: "Business Phone", type: "input", placeholder: "e.g. +33 1 23 45 67 89", required: true },
      { label: "Business Email", type: "input", placeholder: "contact@yourbusiness.com", required: true },
      { label: "Business Address", type: "input", placeholder: "e.g. 12 Rue de la Paix, 75002 Paris" },
      { label: "About the Business", type: "textarea", helperText: "Tell us anything you would like customers to know about the business, your experience, approach, atmosphere or story. Optional." }
    ]
  },
  {
    title: "2. Location & Opening Hours",
    fields: [
      { label: "Where do you provide your services?", type: "radio", options: ["At our salon / studio", "At customers' homes", "Both"], required: true },
      { label: "Salon / Studio Address", type: "input", placeholder: "Full address, suite, floor, door code if needed", condition: { field: "Where do you provide your services?", value: "At our salon / studio" } },
      { label: "Areas you travel to", type: "textarea", placeholder: "e.g. Paris 1st-8th arrondissements, Boulogne-Billancourt, Neuilly", helperText: "Cities, neighbourhoods or areas where you provide mobile massage services.", condition: { field: "Where do you provide your services?", value: "At customers' homes" } },
      { label: "Are your opening hours on Google currently correct?", type: "radio", options: ["Yes", "No", "We do not have a Google Business Profile", "Not sure"] },
      { label: "Please enter the correct opening hours.", type: "textarea", placeholder: "e.g. Monday - Saturday: 10:00 - 20:00, Sunday: Closed", condition: { field: "Are your opening hours on Google currently correct?", value: "No" } }
    ]
  },
  {
    title: "3. Treatments, Services & Prices",
    description: "The purpose of this section is to avoid making you manually enter information that already exists online.",
    fields: [
      { label: "Are your current treatments, durations and prices already listed online?", type: "radio", options: ["Yes", "No", "Partially"] },
      { label: "Link to your services / booking / price list", type: "textarea", placeholder: "Paste links to your booking page, website, Instagram menu, Google page, etc.", helperText: "If your services and prices are already correct online, you do not need to enter everything again.", condition: { field: "Are your current treatments, durations and prices already listed online?", value: "Yes" } },
      { label: "Is the information at the link above currently correct and up to date?", type: "radio", options: ["Yes — you can use it", "Mostly — I will explain the changes below", "No"], condition: { field: "Are your current treatments, durations and prices already listed online?", value: "Yes" } },
      { label: "What needs to be changed?", type: "textarea", placeholder: "Describe any price changes, removed services, or updated durations...", condition: { field: "Is the information at the link above currently correct and up to date?", value: "Mostly — I will explain the changes below" } },
      { label: "Are there any treatments you especially want featured on the website?", type: "textarea", placeholder: "e.g. Traditional Thai Massage, Hot Stone, Deep Tissue, Couples Massage", helperText: "For example: Traditional Thai Massage, Couples Massage, Hot Oil Massage, Deep Tissue Massage, Foot Massage, etc." },
      { label: "How would you like prices shown on the website?", type: "radio", options: ["Show all treatments, durations and prices", "Show main treatments with starting prices", "Do not show prices — customers will see them when booking", "I'm not sure — choose what works best"] },
      { label: "Please give us the details or provide a link where we can find them.", type: "textarea", placeholder: "Details regarding packages, gift cards, couple rates or promotions..." }
    ]
  },
  {
    title: "4. Booking & Customer Contact",
    fields: [
      { label: "Do you currently use an online booking system?", type: "radio", options: ["Fresha", "Treatwell", "Planity", "Calendly", "Another booking system", "No online booking system"] },
      { label: "Booking System Name", type: "input", placeholder: "e.g. Mindbody, Booksy, Timely", condition: { field: "Do you currently use an online booking system?", value: "Another booking system" } },
      { label: "Booking Page Link", type: "input", placeholder: "https://", requiredCondition: { field: "Do you currently use an online booking system?", value: "Fresha" } },
      { label: "WhatsApp Number", type: "input", placeholder: "+33 6 12 34 56 78" },
      { label: "Contact Email", type: "input", placeholder: "Leave blank to use Business Email, or enter a separate email", helperText: "Uses the Business Email from Section 1 unless you provide another email here." },
      { label: "Is there anything customers should know before booking or arriving?", type: "textarea", placeholder: "e.g. Please arrive 5 minutes early, street parking available, cash or card accepted...", helperText: "For example: arrival instructions, cancellation policy, health considerations, building access, preparation before treatment, or anything else you normally tell customers." }
    ]
  },
  {
    title: "5. Business & Team",
    fields: [
      { label: "Would you like your massage therapists or team members shown on the website?", type: "radio", options: ["Yes", "No", "Not sure"] },
      { label: "Is there anything special about your massage techniques, therapists or business that you would like mentioned?", type: "textarea", placeholder: "e.g. Authentic Wat Pho certified therapists, organic oils imported from Thailand...", helperText: "For example: authentic Thai techniques, therapist experience, certifications, atmosphere, special training, personalised treatments, etc." }
    ]
  },
  {
    title: "6. Photos & Content",
    fields: [
      { label: "Business Logo", type: "file", accept: "image/*,.pdf,.svg" },
      { label: "Salon / Studio Photos", type: "gallery", maxFiles: 60, helperText: "Interior, massage rooms, reception, waiting area, relaxing atmosphere." },
      { label: "Massage / Treatment Photos", type: "gallery", maxFiles: 60, helperText: "Treatments in action, massage tables, oils, hot stones, towels." },
      { label: "Therapist / Team Photos", type: "gallery", maxFiles: 60, helperText: "Therapist portraits, team photos, uniform or working attire." },
      { label: "Exterior / Entrance Photos", type: "gallery", maxFiles: 60, helperText: "Shopfront, building entrance, street view to help customers locate the salon." },
      { label: "Other Photos or Files", type: "gallery", maxFiles: 60, helperText: "Brochures, price list flyers, certificates, decor details." },
      { label: "Are there any photos or materials that you do NOT want used on the website?", type: "textarea", placeholder: "e.g. Do not use outdated photos with old therapists or old decor." }
    ]
  },
  {
    title: "7. Online Profiles",
    fields: [
      { label: "Google Business Profile / Google Maps Link", type: "input", placeholder: "https://maps.google.com/..." },
      { label: "Instagram", type: "input", placeholder: "https://instagram.com/..." },
      { label: "Facebook", type: "input", placeholder: "https://facebook.com/..." },
      { label: "TikTok", type: "input", placeholder: "https://tiktok.com/@..." },
      { label: "Booking Profile Link", type: "input", placeholder: "https://..." },
      { label: "Other Important Link", type: "input", placeholder: "TripAdvisor, Yelp, or other directory" }
    ]
  },
  {
    title: "8. Domain",
    fields: [
      { label: "Do you already own a domain name for the business?", type: "radio", options: ["Yes", "No", "Not sure"] },
      { label: "Domain Name", type: "input", placeholder: "yourbusiness.fr", helperText: "Example: yourbusiness.fr", condition: { field: "Do you already own a domain name for the business?", value: "Yes" }, required: true }
    ]
  },
  {
    title: "9. Additional Information",
    fields: [
      { label: "Anything Else We Should Know?", type: "textarea", placeholder: "If there is anything else you want included, avoided or considered for the website, tell us here.", helperText: "If there is anything else you want included, avoided or considered for the website, tell us here." }
    ]
  }
];

