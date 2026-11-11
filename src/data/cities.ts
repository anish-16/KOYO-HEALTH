import { slugify } from '@/lib/utils';
import type { City } from './types';

type Row = [name: string, state: string, centers: number, tests: number, pincode: string, popular: boolean, localities: string[], year: number];

const rows: Row[] = [
  ['Delhi', 'Delhi NCR', 74, 1712, '110001', true, ['Connaught Place', 'Saket', 'Dwarka', 'Rohini'], 2019],
  ['Gurugram', 'Haryana', 48, 1640, '122001', true, ['DLF Phase 3', 'Sector 56', 'Golf Course Road', 'Sohna Road'], 2019],
  ['Noida', 'Uttar Pradesh', 36, 1622, '201301', true, ['Sector 62', 'Sector 18', 'Greater Noida West'], 2019],
  ['Mumbai', 'Maharashtra', 88, 1708, '400001', true, ['Andheri', 'Bandra', 'Powai', 'Lower Parel'], 2020],
  ['Bengaluru', 'Karnataka', 82, 1695, '560001', true, ['Indiranagar', 'Koramangala', 'Whitefield', 'Jayanagar'], 2020],
  ['Hyderabad', 'Telangana', 64, 1688, '500001', true, ['Banjara Hills', 'Gachibowli', 'Kukatpally'], 2020],
  ['Chennai', 'Tamil Nadu', 58, 1670, '600001', true, ['Adyar', 'Anna Nagar', 'Velachery'], 2020],
  ['Pune', 'Maharashtra', 52, 1665, '411001', true, ['Koregaon Park', 'Baner', 'Kothrud'], 2020],
  ['Kolkata', 'West Bengal', 44, 1652, '700001', true, ['Salt Lake', 'Ballygunge', 'New Town'], 2020],
  ['Ahmedabad', 'Gujarat', 38, 1640, '380001', false, ['Satellite', 'Bodakdev', 'Maninagar'], 2021],
  ['Chandigarh', 'Punjab', 26, 1588, '160001', false, ['Sector 17', 'Sector 35', 'Mohali'], 2021],
  ['Jaipur', 'Rajasthan', 32, 1602, '302001', false, ['Malviya Nagar', 'Vaishali Nagar', 'C-Scheme'], 2021],
  ['Lucknow', 'Uttar Pradesh', 28, 1590, '226001', false, ['Gomti Nagar', 'Hazratganj', 'Alambagh'], 2021],
  ['Indore', 'Madhya Pradesh', 24, 1572, '452001', false, ['Vijay Nagar', 'Palasia'], 2021],
  ['Bhopal', 'Madhya Pradesh', 18, 1540, '462001', false, ['Arera Colony', 'MP Nagar'], 2022],
  ['Surat', 'Gujarat', 22, 1560, '395001', false, ['Vesu', 'Adajan'], 2022],
  ['Vadodara', 'Gujarat', 16, 1520, '390001', false, ['Alkapuri', 'Gotri'], 2022],
  ['Nagpur', 'Maharashtra', 20, 1545, '440001', false, ['Dharampeth', 'Civil Lines'], 2022],
  ['Nashik', 'Maharashtra', 14, 1490, '422001', false, ['College Road', 'Gangapur Road'], 2022],
  ['Thane', 'Maharashtra', 26, 1610, '400601', false, ['Ghodbunder Road', 'Vartak Nagar'], 2021],
  ['Navi Mumbai', 'Maharashtra', 24, 1600, '400703', false, ['Vashi', 'Nerul', 'Kharghar'], 2021],
  ['Kochi', 'Kerala', 20, 1568, '682001', false, ['Kakkanad', 'Panampilly Nagar'], 2022],
  ['Thiruvananthapuram', 'Kerala', 14, 1500, '695001', false, ['Kowdiar', 'Technopark'], 2023],
  ['Coimbatore', 'Tamil Nadu', 18, 1530, '641001', false, ['RS Puram', 'Peelamedu'], 2022],
  ['Madurai', 'Tamil Nadu', 10, 1440, '625001', false, ['Anna Nagar', 'KK Nagar'], 2023],
  ['Mysuru', 'Karnataka', 12, 1460, '570001', false, ['Vijayanagar', 'Saraswathipuram'], 2023],
  ['Mangaluru', 'Karnataka', 9, 1420, '575001', false, ['Kadri', 'Hampankatta'], 2023],
  ['Visakhapatnam', 'Andhra Pradesh', 16, 1512, '530001', false, ['MVP Colony', 'Gajuwaka'], 2022],
  ['Vijayawada', 'Andhra Pradesh', 12, 1470, '520001', false, ['Benz Circle', 'Patamata'], 2023],
  ['Bhubaneswar', 'Odisha', 14, 1495, '751001', false, ['Patia', 'Saheed Nagar'], 2023],
  ['Patna', 'Bihar', 12, 1470, '800001', false, ['Boring Road', 'Kankarbagh'], 2023],
  ['Ranchi', 'Jharkhand', 8, 1390, '834001', false, ['Lalpur', 'Harmu'], 2024],
  ['Guwahati', 'Assam', 10, 1420, '781001', false, ['Zoo Road', 'Six Mile'], 2023],
  ['Dehradun', 'Uttarakhand', 8, 1380, '248001', false, ['Rajpur Road', 'Clement Town'], 2024],
  ['Ludhiana', 'Punjab', 14, 1480, '141001', false, ['Sarabha Nagar', 'Model Town'], 2022],
  ['Amritsar', 'Punjab', 9, 1400, '143001', false, ['Ranjit Avenue', 'Lawrence Road'], 2023],
  ['Jalandhar', 'Punjab', 7, 1350, '144001', false, ['Model Town', 'Urban Estate'], 2024],
  ['Agra', 'Uttar Pradesh', 8, 1370, '282001', false, ['Sanjay Place', 'Dayalbagh'], 2024],
  ['Varanasi', 'Uttar Pradesh', 9, 1395, '221001', false, ['Sigra', 'Lanka'], 2023],
  ['Kanpur', 'Uttar Pradesh', 11, 1430, '208001', false, ['Swaroop Nagar', 'Civil Lines'], 2023],
  ['Meerut', 'Uttar Pradesh', 7, 1340, '250001', false, ['Shastri Nagar', 'Ganga Nagar'], 2024],
  ['Raipur', 'Chhattisgarh', 8, 1360, '492001', false, ['Shankar Nagar', 'Pandri'], 2024],
  ['Udaipur', 'Rajasthan', 6, 1310, '313001', false, ['Fateh Sagar', 'Hiran Magri'], 2024],
  ['Jodhpur', 'Rajasthan', 7, 1330, '342001', false, ['Sardarpura', 'Shastri Nagar'], 2024],
  ['Kolhapur', 'Maharashtra', 6, 1300, '416001', false, ['Rajarampuri', 'Shivaji Peth'], 2024],
  ['Aurangabad', 'Maharashtra', 7, 1320, '431001', false, ['CIDCO', 'Kranti Chowk'], 2024],
  ['Goa', 'Goa', 5, 1260, '403001', false, ['Panaji', 'Margao'], 2024],
  ['Shimla', 'Himachal Pradesh', 4, 1220, '171001', false, ['Mall Road', 'Sanjauli'], 2024],
];

export const cities: City[] = rows.map(([name, state, centers, tests, pincode, popular, localities, launchYear]) => ({
  slug: slugify(name),
  name,
  state,
  centers,
  tests,
  pincode,
  popular,
  localities,
  launchYear,
}));

export const topCities = cities.filter((c) => c.popular);

export function getCity(slug: string) {
  return cities.find((c) => c.slug === slug);
}

export const cityStats = {
  count: cities.length,
  states: new Set(cities.map((c) => c.state)).size,
  centers: cities.reduce((sum, c) => sum + c.centers, 0),
  tests: Math.max(...cities.map((c) => c.tests)),
};
