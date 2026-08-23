const U = "https://homegeniee.com/wp-content/uploads";

export const productCategories = [
  { id: "puja-utility", label: "Puja Utility" },
  { id: "kitchen-utility", label: "Kitchen Utility" },
  { id: "study-utility", label: "Study Utility" },
  { id: "wall-utility", label: "Wall Utility" },
  { id: "wall-shelving", label: "Wall Shelving" },
  { id: "shoe-cabinet", label: "Shoe Utility" },
];

// Price null = "Read more" on the live site (enquiry-only, no listed price).
// `custom` mirrors the "Customization Available" note on the product card.
const p = (id, name, category, price, image, custom = true, isNew = true) =>
  ({ id, name, category, price, image: `${U}/${image}`, custom, isNew });

export const products = [
  p("puja-unit-10", "Puja Unit 10", "puja-utility", 6700, "2024/09/M-10-RED-OPREN.png"),
  p("puja-unit-09", "Puja Unit 09", "puja-utility", 6500, "2024/09/model-9-open-red.png"),
  p("puja-unit-08", "Puja Unit 08", "puja-utility", 6500, "2024/09/model-8-red-open.png"),
  p("puja-unit-07", "Puja Unit 07", "puja-utility", 6500, "2024/09/MODEL-7-RED-OPEN.png"),
  p("puja-unit-06", "Puja Unit 06", "puja-utility", 6500, "2024/09/M-6-RED-CHAIN.png"),
  p("puja-unit-05", "Puja Unit 05", "puja-utility", 6500, "2024/09/MODEL-5-RED-OPEN.png"),
  p("puja-unit-04", "Puja Unit 04", "puja-utility", 5500, "2024/09/MODEL-4-RED-OPEN.png"),
  p("puja-unit-03", "Puja Unit 03", "puja-utility", 4500, "2024/09/Untitled-2-with-figure-with-logo.jpg"),
  p("puja-unit-02", "Puja Unit 02", "puja-utility", 4800, "2024/09/p-14-y.jpg"),
  p("puja-unit-01", "Puja Unit 01", "puja-utility", 4500, "2024/09/PUJA-M02-D.png"),

  p("kitchen-utility-04", "Kitchen Utility 04", "kitchen-utility", null, "2024/09/4444.png", false),
  p("kitchen-utility-03", "Kitchen Utility 03", "kitchen-utility", null, "2024/09/00003.png", false),
  p("kitchen-utility-02", "Kitchen Utility 02", "kitchen-utility", null, "2024/09/00-2.png", false),
  p("kitchen-utility-01", "Kitchen Utility 01", "kitchen-utility", null, "2024/09/N-00001.png", false),

  p("study-utility-08", "Study Utility 08", "study-utility", null, "2024/09/RACK-8.jpg"),
  p("study-utility-07", "Study Utility 07", "study-utility", null, "2024/09/rack-7-a-1.jpg"),
  p("study-utility-06", "Study Utility 06", "study-utility", null, "2024/09/RACK-6.jpg"),
  p("study-utility-05", "Study Utility 05", "study-utility", null, "2024/09/RACK-5.jpg"),
  p("study-utility-04", "Study Utility 04", "study-utility", null, "2024/09/RACK-4.jpg"),
  p("study-utility-03", "Study Utility 03", "study-utility", null, "2024/09/model-with-logo-front-view-clode.jpg"),
  p("study-utility-02", "Study Utility 02", "study-utility", null, "2024/09/R-222.png"),
  p("study-utility-01", "Study Utility 01", "study-utility", null, "2024/09/RACK-1-straight.jpg"),

  p("wall-utility-10", "Wall Utility 10", "wall-utility", null, "2024/09/sh-10-study.jpg"),
  p("wall-utility-09", "Wall Utility 09", "wall-utility", null, "2024/09/sh-9-study.jpg"),
  p("wall-utility-08", "Wall Utility 08", "wall-utility", null, "2024/09/sh-08-study.jpg"),
  p("wall-utility-07", "Wall Utility 07", "wall-utility", null, "2024/09/sh-07-wall.jpg"),
  p("wall-utility-06", "Wall Utility 06", "wall-utility", null, "2024/09/sh-06-wall.jpg"),
  p("wall-utility-05", "Wall Utility 05", "wall-utility", null, "2024/09/sh-05-study.jpg"),
  p("wall-utility-04", "Wall Utility 04", "wall-utility", null, "2024/09/SH-04-WALL.jpg"),
  p("wall-utility-03", "Wall Utility 03", "wall-utility", null, "2024/09/SH-03-WALL.jpg"),
  p("wall-utility-02", "Wall Utility 02", "wall-utility", null, "2024/09/SH-02-WALL.jpg"),
  p("wall-utility-01", "Wall Utility 01", "wall-utility", null, "2024/09/M-1-WALL-1.jpg"),

  p("wall-shelving-09", "Wall Shelving 09", "wall-shelving", null, "2024/11/M-9.jpg"),
  p("wall-shelving-08", "Wall Shelving 08", "wall-shelving", null, "2024/11/m-8-pres.jpg"),
  p("wall-shelving-07", "Wall Shelving 07", "wall-shelving", null, "2024/11/M-7.jpg"),
  p("wall-shelving-06", "Wall Shelving 06", "wall-shelving", null, "2024/11/m-6.jpg"),
  p("wall-shelving-05", "Wall Shelving 05", "wall-shelving", null, "2024/11/m-5.jpg"),
  p("wall-shelving-04", "Wall Shelving 04", "wall-shelving", null, "2024/11/m-4-f.jpg"),
  p("wall-shelving-03", "Wall Shelving 03", "wall-shelving", null, "2024/11/M-3.jpg"),
  p("wall-shelving-02", "Wall Shelving 02", "wall-shelving", null, "2024/11/M-2.jpg"),
  p("wall-shelving-01", "Wall Shelving 01", "wall-shelving", null, "2024/09/M1-SOLO.png"),

  p("shoe-cabinet-09", "Shoe Cabinet 09", "shoe-cabinet", null, "2024/09/Untitled-3-8.jpg"),
  p("shoe-cabinet-08", "Shoe Cabinet 08", "shoe-cabinet", null, "2024/09/Untitled-3-7.jpg"),
  p("shoe-cabinet-07", "Shoe Cabinet 07", "shoe-cabinet", null, "2024/09/Untitled-2-8.jpg", true, false),
  p("shoe-cabinet-06", "Shoe Cabinet 06", "shoe-cabinet", null, "2024/09/Untitled-2-7.jpg"),
  p("shoe-cabinet-05", "Shoe Cabinet 05", "shoe-cabinet", null, "2024/09/Untitled-2-4.jpg"),
  p("shoe-cabinet-04", "Shoe Cabinet 04", "shoe-cabinet", null, "2024/09/Untitled-4.jpg"),
  p("shoe-cabinet-03", "Shoe Cabinet 03", "shoe-cabinet", null, "2024/09/3.jpg", true, false),
  p("shoe-cabinet-02", "Shoe Cabinet 02", "shoe-cabinet", null, "2024/09/Untitled-1-2.jpg"),
  p("shoe-cabinet-01", "Shoe Cabinet 01", "shoe-cabinet", null, "2024/09/1-OPEN.jpg"),
];

export const orderWhatsapp = "919831687191";
export const orderWhatsappLabel = "+91 98316 87191";
