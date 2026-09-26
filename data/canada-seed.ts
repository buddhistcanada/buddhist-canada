export type SeedPlace = {
  name: string
  address?: string
  city: string
  province: string
  postalCode?: string
  phone?: string
  email?: string
  website?: string
  tradition?: string
  sourceName: string
  sourceUrl: string
  sourceCheckedAt: string
  verified: false
}

// Research seed only. Records remain unverified until an administrator checks the current source.
export const canadaSeedPlaces: SeedPlace[] = [
  { name: 'Calgary Buddhist Temple', city: 'Calgary', province: 'Alberta', address: '207 6th Street NE, Calgary, AB T2E 3Y1', phone: '(403) 263-5723', website: 'https://www.calgary-buddhist.ab.ca/', tradition: 'Mahayana', sourceName: 'BuddhaNet World Buddhist Directory', sourceUrl: 'https://www.buddhanet.info/wbd/province.php?province_id=9', sourceCheckedAt: '2026-09-26', verified: false },
  { name: 'Buddhist Center Calgary', city: 'Calgary', province: 'Alberta', address: '10823 Brae Place SW, Calgary, AB T2W 1E4', email: 'Calgary@diamondway-center.org', tradition: 'Vajrayana / Tibetan / Karma Kagyu', sourceName: 'BuddhaNet World Buddhist Directory', sourceUrl: 'https://www.buddhanet.info/wbd/province.php?province_id=9', sourceCheckedAt: '2026-09-26', verified: false },
  { name: 'Buddhist Center Edmonton', city: 'Edmonton', province: 'Alberta', address: 'c/o Mike Freeland and BJ Tumanut #403, 10314 82nd Ave, Edmonton, AB T6E 1Z8', phone: '(780) 455-5488', email: 'Edmonton@diamondway-center.org', website: 'http://www.diamondway.org/edmonton/', tradition: 'Vajrayana / Tibetan / Karma Kagyu', sourceName: 'BuddhaNet World Buddhist Directory', sourceUrl: 'https://www.buddhanet.info/wbd/province.php?province_id=9', sourceCheckedAt: '2026-09-26', verified: false },
  { name: 'Buddhist Temple of Southern Alberta', city: 'Lethbridge', province: 'Alberta', address: '470 40 Street South, Lethbridge, AB', tradition: 'Mahayana', sourceName: 'BuddhaNet World Buddhist Directory', sourceUrl: 'https://www.buddhanet.info/wbd/province.php?province_id=9', sourceCheckedAt: '2026-09-26', verified: false },
  { name: 'Myanmar Buddhist Temple - Calgary', city: 'Calgary', province: 'Alberta', address: '1408 27th Street SE, Calgary, AB T2A 7A4', phone: '(403) 460-3161', email: 'mbt069@gmail.com', tradition: 'Theravada / Vipassana', sourceName: 'BuddhaNet World Buddhist Directory', sourceUrl: 'https://www.buddhanet.info/wbd/province.php?province_id=9', sourceCheckedAt: '2026-09-26', verified: false },
  { name: 'Buddhist Vihara Society in BC', city: 'Surrey', province: 'British Columbia', address: '18941 80 Avenue, Surrey, BC V4N 4J1', phone: '+1 604-888-1162', email: 'bvs_bc@yahoo.ca', website: 'http://www.bvs.org', tradition: 'Theravada', sourceName: 'BuddhaNet World Buddhist Directory', sourceUrl: 'https://www.buddhanet.info/wbd/country.php?country_id=1', sourceCheckedAt: '2026-09-26', verified: false },
  { name: 'Manitoba Buddhist Temple', city: 'Winnipeg', province: 'Manitoba', address: '39 Tecumseh St., Winnipeg, MB R3E 0J8', email: 'ulrich@mts.ca', website: 'http://www.manitobabuddhistchurch.org', sourceName: 'Buddhist Churches of Canada directory', sourceUrl: 'https://www.vancouverhistory.ca/wp-content/uploads/2021/02/Buddhist-Churches-of-Canada.pdf', sourceCheckedAt: '2026-09-26', verified: false },
  { name: 'Toronto Buddhist Church / Living Dharma Centre', city: 'Toronto', province: 'Ontario', address: '1011 Sheppard Avenue West, Toronto, ON M3H 2T7', phone: '(416) 534-4302', email: 'tbc@tbc.on.ca', website: 'http://www.tbc.on.ca', sourceName: 'Buddhist Churches of Canada directory', sourceUrl: 'https://www.vancouverhistory.ca/wp-content/uploads/2021/02/Buddhist-Churches-of-Canada.pdf', sourceCheckedAt: '2026-09-26', verified: false },
  { name: 'Buddhist Prajna Temple', city: 'Kitchener', province: 'Ontario', address: '265 King Street East, Unit 301, Kitchener, ON N2G 4N4', phone: '(519) 579-3046', email: 'prajna_temple@yahoo.com', website: 'http://www.prajnatemple.org', tradition: 'Mahayana / Pure Land', sourceName: 'BuddhaNet World Buddhist Directory', sourceUrl: 'https://www.buddhanet.info/wbd/country.php?country_id=1', sourceCheckedAt: '2026-09-26', verified: false },
  { name: 'Buddhist Society of Newfoundland & Labrador', city: "St. John's", province: 'Newfoundland and Labrador', address: "PO Box 432, Goulds, St. John's, NL A1S 1G5", phone: '(709) 745-3129', email: 'uperera@avalon.nf.ca', tradition: 'Theravada / Sri Lankan', sourceName: 'BuddhaNet World Buddhist Directory', sourceUrl: 'https://www.buddhanet.info/wbd/country.php?country_id=1', sourceCheckedAt: '2026-09-26', verified: false },
  { name: 'Atlantic Theravada Buddhist Cultural and Meditation Society', city: 'Halifax', province: 'Nova Scotia', address: '817 Herring Cove Road, Halifax, NS', website: 'http://www.atlanticbuddhist.com/', tradition: 'Theravada', sourceName: 'Royal Thai Embassy Ottawa', sourceUrl: 'https://ottawa.thaiembassy.org/en/page/buddhist-temples-and-monasteries', sourceCheckedAt: '2026-09-26', verified: false },
  { name: 'Tisarana Buddhist Monastery', city: 'Perth', province: 'Ontario', address: '1356 Powers Road, RR#3, Perth, ON K7H 3C5', phone: '(613) 264-8208', website: 'https://www.tisarana.ca/', sourceName: 'Royal Thai Embassy Ottawa', sourceUrl: 'https://ottawa.thaiembassy.org/en/page/buddhist-temples-and-monasteries', sourceCheckedAt: '2026-09-26', verified: false }
]
