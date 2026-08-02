const sampleListings = [
  {
    title: "Luxury Valley View Villa",
    description:
      "Escape to this luxurious villa nestled in the beautiful valleys of Manali. Enjoy breathtaking mountain views, spacious bedrooms, modern interiors, a private garden, and peaceful evenings by the fireplace. Perfect for families and couples looking for a relaxing getaway.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784978774/aionzuwqgbyg4tds7gos.avif",
    },
    price: 7500,
    location: "Manali",
    country: "India",
    category: "Mountain",
  },

  {
    title: "Beachfront Escape",
    description:
      "Wake up to the soothing sound of waves in this premium beachfront villa located in North Goa. Featuring elegant interiors, private balconies, direct beach access, and stunning sunset views, it's the perfect destination for a tropical vacation.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784978776/dusevysez4wwzverk89r.jpg",
    },
    price: 4200,
    location: "North Goa",
    country: "India",
    category: "Beach",
  },

  {
    title: "Heritage Haveli Stay",
    description:
      "Experience the royal charm of Rajasthan in this beautifully restored haveli. Featuring traditional architecture, handcrafted interiors, spacious courtyards, and modern amenities, this stay offers an authentic cultural experience.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784978778/oizshlchhoknefnqgb6j.jpg",
    },
    price: 5800,
    location: "Jaipur",
    country: "India",
    category: "Heritage",
  },

  {
    title: "Tea Estate Cottage",
    description:
      "Surrounded by lush green tea plantations, this charming cottage offers breathtaking scenery, cool weather, wooden interiors, and a peaceful atmosphere ideal for nature lovers and weekend retreats.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784979604/gokiiftzkh7tiqsi4vdm.jpg",
    },
    price: 6400,
    location: "Munnar",
    country: "India",
    category: "Nature",
  },

  {
    title: "Himalayan Glass Cabin",
    description:
      "Stay in a luxurious glass cabin offering panoramic views of the Himalayas. Enjoy unforgettable sunrises, cozy evenings, modern architecture, and complete privacy amidst nature.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784979218/ai43mabzhmyroprestec.jpg",
    },
    price: 9800,
    location: "Shimla",
    country: "India",
    category: "Mountain",
    isTrending: true,
  },

  {
    title: "Coffee Plantation Homestay",
    description:
      "Nestled within a beautiful coffee estate in Coorg, this peaceful homestay offers fresh air, plantation walks, traditional cuisine, and comfortable rooms surrounded by lush greenery.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784979213/lvafce3q8ps9l2xkncn1.webp",
    },
    price: 5500,
    location: "Coorg",
    country: "India",
    category: "Nature",
  },

  {
    title: "Royal Lake Palace Retreat",
    description:
      "Enjoy luxury by the lakeside in Udaipur with elegant rooms, stunning lake views, rooftop dining, and warm Rajasthani hospitality. A perfect destination for couples and luxury travelers.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784979205/wxo83yphx6jbyhzvljhd.jpg",
    },
    price: 8900,
    location: "Udaipur",
    country: "India",
    category: "Heritage",
    isTrending: true,
  },

  {
    title: "Royal Desert Camp",
    description:
      "Spend magical nights beneath the stars in this luxury desert camp. Enjoy camel safaris, cultural performances, authentic Rajasthani cuisine, and premium tent accommodations in the heart of the Thar Desert.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784979198/rspc0qjjjewbnuuiraj9.jpg",
    },
    price: 6800,
    location: "Jaisalmer",
    country: "India",
    category: "Unique",
  },

  {
    title: "Riverside Cottage",
    description:
      "Located on the peaceful banks of the Ganga, this riverside cottage offers scenic river views, yoga sessions, adventure sports nearby, and a relaxing escape into nature.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784979615/lvhkhhhzxwjrbm5ajqyk.jpg",
    },
    price: 5900,
    location: "Rishikesh",
    country: "India",
    category: "Nature",
  },

  {
    title: "Skyline Penthouse",
    description:
      "Experience luxury living in the heart of Mumbai with this premium penthouse featuring floor-to-ceiling windows, skyline views, designer interiors, a rooftop lounge, and world-class amenities.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784979621/u1spbszter8mo7iskic6.jpg",
    },
    price: 11500,
    location: "Mumbai",
    country: "India",
    category: "City",
  },
    {
    title: "Backwater Houseboat",
    description:
      "Cruise through Kerala's serene backwaters aboard this beautifully designed luxury houseboat. Enjoy authentic Kerala cuisine, peaceful waterways, cozy bedrooms, and unforgettable sunset views.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784979628/kwqxytnkreha0j00lylm.jpg",
    },
    price: 12500,
    location: "Alappuzha",
    country: "India",
    category: "Unique",
    isTrending: true,
  },

  {
    title: "Misty Hills Resort",
    description:
      "Nestled amidst the rolling hills of Ooty, this premium resort offers breathtaking valley views, elegant rooms, lush gardens, and the perfect escape from city life.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784980718/n0h8uz09eoav1ksww5wm.jpg",
    },
    price: 7400,
    location: "Ooty",
    country: "India",
    category: "Mountain",
    isTrending: true,
  },

  {
    title: "Colonial Garden Villa",
    description:
      "Experience the charm of French architecture in this elegant colonial villa located in the heart of Puducherry. Spacious rooms, peaceful gardens, and cozy cafés are just a short walk away.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784980712/jodpvz4asbcjiegrgori.jpg",
    },
    price: 6900,
    location: "Puducherry",
    country: "India",
    category: "Beach",
    isTrending: true,
  },

  {
    title: "Urban Luxury Apartment",
    description:
      "Located in the vibrant city of Bengaluru, this stylish apartment offers modern interiors, high-speed Wi-Fi, premium furnishings, and easy access to tech parks and popular cafés.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784980702/gkwpwomli3c0eunvw9xy.jpg",
    },
    price: 6200,
    location: "Bengaluru",
    country: "India",
    category: "City",
  },

  {
    title: "Palace View Residency",
    description:
      "Wake up to magnificent views of Jodhpur's iconic Mehrangarh Fort while enjoying luxurious rooms, rooftop dining, and authentic Rajasthani hospitality.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784980695/jjvhocndobsjgblvhssg.jpg",
    },
    price: 7300,
    location: "Jodhpur",
    country: "India",
    category: "Heritage",
  },

  {
    title: "Forest Eco Lodge",
    description:
      "Reconnect with nature at this eco-friendly wooden lodge surrounded by the lush forests of Wayanad. Ideal for wildlife enthusiasts, trekkers, and anyone seeking tranquility.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784980949/ln9plyhp1nt638czqd9b.jpg",
    },
    price: 5800,
    location: "Wayanad",
    country: "India",
    category: "Nature",
    isTrending: true,
  },

  {
    title: "Snow Peak Chalet",
    description:
      "A cozy alpine chalet nestled amidst the snow-covered landscapes of Gulmarg. Enjoy fireplaces, breathtaking mountain views, skiing adventures, and luxurious comfort.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784980941/j5na5mduhekilb5uha4d.jpg",
    },
    price: 9600,
    location: "Gulmarg",
    country: "India",
    category: "Mountain",
    isTrending: true,
  },

  {
    title: "Vineyard Retreat",
    description:
      "Relax in this boutique vineyard resort surrounded by lush vineyards and rolling hills. Enjoy wine-tasting experiences, peaceful surroundings, and luxurious accommodations.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784980933/slbnyn7ev5ev0ssxhue2.jpg",
    },
    price: 7100,
    location: "Nashik",
    country: "India",
    category: "Nature",
  },

  {
    title: "Sunset Cliff Villa",
    description:
      "Perched on the scenic cliffs of Varkala, this elegant villa offers breathtaking sea views, private balconies, modern interiors, and spectacular sunsets every evening.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784981109/frkywqxwwkbcxmmrawmd.jpg",
    },
    price: 8800,
    location: "Varkala",
    country: "India",
    category: "Beach",
  },

  {
    title: "Lakeside Luxury Resort",
    description:
      "Escape to this luxurious lakeside resort in Lonavala featuring an infinity pool, spa treatments, fine dining, spacious suites, and mesmerizing views of Pawna Lake.",
    image: {
      filename: "listingimage",
      url: "https://res.cloudinary.com/mwp7z9qs/image/upload/v1784981099/nxdsyu5ytaithwk9ibuc.jpg",
    },
    price: 10500,
    location: "Lonavala",
    country: "India",
    category: "Nature",
  },

];

module.exports = { data: sampleListings };
