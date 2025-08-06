import { Product, Query } from '../types';

// Complete list of cashew grades
export const cashewGrades = [
  'A180', 'W210', 'W240', 'W320', 'W400',
  'A210(W210)', 'A240(W240)', 'A320(W320)', 'A400(W400)',
  'JK0', 'K00', 'LWP', 'S00 (JH)', 'SK0',
  'SSW(WW320)', 'SSW1(W300)', 'SWP',
  'BB0', 'BB1', 'BB2',
  'DP0', 'DP1', 'DP2',
  'DS0', 'DW0', 'DW1', 'DW2', 'DW (S)',
  'FW0', 'FW1', 'FW2', 'HDW', 'JH0',
  'KW0', 'KW1', 'KW2',
  'OP0', 'OW0', 'OW1', 'OW2',
  'PKP', 'PKS', 'RW1', 'RW2', 'SDP',
  'SK1', 'SS0', 'SSP', 'SSP1', 'SSP2',
  'SW240', 'SWP1', 'SWP2'
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'W320 Cashew Kernels',
    grade: 'W320',
    pricePerKg: 85,
    location: 'Mangalore',
    image: 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=400',
    specifications: 'Premium quality W320 grade cashew kernels, 100% natural, 320 pieces per pound',
    deliveryTime: '3-5 business days'
  },
  {
    id: '2',
    name: 'W180 Cashew Kernels',
    grade: 'W180',
    pricePerKg: 95,
    location: 'Panruti',
    image: 'https://images.pexels.com/photos/1630588/pexels-photo-1630588.jpeg?auto=compress&cs=tinysrgb&w=400',
    specifications: 'Premium quality W180 grade cashew kernels, 180 pieces per pound',
    deliveryTime: '2-4 business days'
  },
  {
    id: '3',
    name: 'LWP Cashew Kernels',
    grade: 'LWP',
    pricePerKg: 75,
    location: 'Mumbai',
    image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=400',
    specifications: 'Large White Pieces - Broken cashew kernels, excellent for processing',
    deliveryTime: '1-3 business days'
  },
  {
    id: '4',
    name: 'SWP Cashew Kernels',
    grade: 'SWP',
    pricePerKg: 70,
    location: 'Kollam',
    image: 'https://images.pexels.com/photos/4198020/pexels-photo-4198020.jpeg?auto=compress&cs=tinysrgb&w=400',
    specifications: 'Small White Pieces - Broken cashew kernels, ideal for bakery use',
    deliveryTime: '2-4 business days'
  },
  {
    id: '5',
    name: 'W240 Cashew Kernels',
    grade: 'W240',
    pricePerKg: 88,
    location: 'Goa',
    image: 'https://images.pexels.com/photos/4110257/pexels-photo-4110257.jpeg?auto=compress&cs=tinysrgb&w=400',
    specifications: 'Premium quality W240 grade cashew kernels, 240 pieces per pound',
    deliveryTime: '3-5 business days'
  },
  {
    id: '6',
    name: 'A180 Cashew Kernels',
    grade: 'A180',
    pricePerKg: 98,
    location: 'Kochi',
    image: 'https://images.pexels.com/photos/4198021/pexels-photo-4198021.jpeg?auto=compress&cs=tinysrgb&w=400',
    specifications: 'Super premium A180 grade cashew kernels, largest size available',
    deliveryTime: '2-3 business days'
  },
  {
    id: '7',
    name: 'BB0 Cashew Kernels',
    grade: 'BB0',
    pricePerKg: 65,
    location: 'Vizag',
    image: 'https://images.pexels.com/photos/4110258/pexels-photo-4110258.jpeg?auto=compress&cs=tinysrgb&w=400',
    specifications: 'Baby Bits - Small broken pieces, perfect for confectionery',
    deliveryTime: '4-6 business days'
  },
  {
    id: '8',
    name: 'JH0 Cashew Kernels',
    grade: 'JH0',
    pricePerKg: 72,
    location: 'Cuddalore',
    image: 'https://images.pexels.com/photos/4198022/pexels-photo-4198022.jpeg?auto=compress&cs=tinysrgb&w=400',
    specifications: 'JH Grade - High quality broken kernels for industrial use',
    deliveryTime: '3-4 business days'
  },
  {
    id: '9',
    name: 'W400 Cashew Kernels',
    grade: 'W400',
    pricePerKg: 78,
    location: 'Pondicherry',
    image: 'https://images.pexels.com/photos/4110259/pexels-photo-4110259.jpeg?auto=compress&cs=tinysrgb&w=400',
    specifications: 'W400 grade cashew kernels, 400 pieces per pound',
    deliveryTime: '2-4 business days'
  },
  {
    id: '10',
    name: 'SSW Cashew Kernels',
    grade: 'SSW(WW320)',
    pricePerKg: 82,
    location: 'Mangalore',
    image: 'https://images.pexels.com/photos/4198023/pexels-photo-4198023.jpeg?auto=compress&cs=tinysrgb&w=400',
    specifications: 'Scorched Slightly Wholes - Premium quality with slight scorching',
    deliveryTime: '3-5 business days'
  }
];

export const mockQueries: Query[] = [
  {
    id: '1',
    type: 'buy',
    productId: '1',
    quantity: 10,
    companyName: 'ABC Foods Ltd',
    pincode: '560001',
    email: 'buyer@abcfoods.com',
    phone: '+919876543210',
    status: 'completed',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    type: 'sell',
    productId: '2',
    quantity: 25,
    companyName: 'XYZ Cashews',
    pincode: '641001',
    email: 'seller@xyzcashews.com',
    phone: '+919876543211',
    gst: 'GST123456789',
    status: 'rejected',
    assignedTo: 'sales@staplewise.com',
    createdAt: new Date('2024-01-14')
  }
];