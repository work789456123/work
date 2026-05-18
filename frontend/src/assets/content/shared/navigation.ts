/**
 * Primary site navigation — single source for desktop dropdowns.
 * Children use `link: null` when the item triggers UI only (e.g. toast).
 */
export const primaryNav = [
  {
    name: "Home",
    link: "/",
    spl: false,
    children: [],
  },
  {
    name: "Pashu Raksha",
    link: null,
    spl: false,
    children: [
      { spl: false, name: "Gopu.AI", link: "/pashucare-suraksha-plan" },
      { spl: false, name: "Care Collection", link: "/marketplace" },
    ],
  },
  {
    spl: false,
    name: "Consult with doctor",
    link: "/appointments",
    children: [],
  },
  {
    spl: false,
    name: "Blogs",
    link: "/blogs",
    children: [],
  },
  {
    spl: false,
    name: "Travel with Pet",
    link: "/travel-with-pet",
    children: [],
  },
  {
    spl: false,
    name: "About PashuVaani",
    link: null,
    children: [
      { spl: false, name: "About Us", link: "/about" },
      { spl: false, name: "Founders Stories", link: "/our-story" },
      { spl: false, name: "Accreditations", link: "/accreditations" },
      { spl: false, name: "Contact Us", link: "/contact" },
    ],
  },
  {
    name: "PashuCare Suraksha Plan",
    link: "/pashucare-suraksha-plan",
    spl: true,
    children: [],
  },
];
