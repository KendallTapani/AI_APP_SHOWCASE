import { DocsUrl, BlogUrl } from '../shared/common';
import daBoiAvatar from '../client/static/da-boi.png';
import avatarPlaceholder from '../client/static/avatar-placeholder.png';
import { routes } from 'wasp/client/router';

export const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: routes.PricingPageRoute.build() },
  { name: 'Contact', href: DocsUrl },

];
export const features = [
  {
    name: 'Subscription Product',
    description: 'Only Pay for the API cost',
    icon: '🧰',
    href: "",
  },
  {
    name: 'Information Secure',
    description: 'Don`t worry about your info getting stolen Just make sure you`re using a good VPN.',
    icon: '🔒',
    href: "",
  },
  {
    name: 'Easy to use, and integrate',
    description: 'Shows you all the information you need, and you can easily click and add it into your wishlist.',
    icon: '⚙',
    href: "",
  },
  {
    name: 'Great way to find out what books to "get"',
    description: 'Sailing the High Seas is boring when you don`t know where to go.',
    icon: '🛥',
    href: "",
  },
  {
    name: 'As Cheap as possible',
    description: 'The Price is only there to keep people from running up Altman`s insane api cost on my account.',
    icon: '💵',
    href: "",
  },
  {
    name: 'Open Source',
    description: 'Check out the code on github',
    icon: '📖',
    href: "",
  },
];
export const testimonials = [
  {
    name: 'Donald T.',
    role: '',
    avatarSrc: daBoiAvatar,
    socialUrl: 'https://x.com/RealTBAlexander',
    quote:
    "Let me tell you, folks, this product is tremendous— absolutely tremendous! The Greatest Product in the history of our country. Everyone's saying it’s the best, and I have to agree; nobody does it better. It's a big product, a beautiful product, the likes of which you've never seen before, and will never again.",
  },

];

export const faqs = [
  {
    id: 1,
    question: 'Whats the meaning of life?',
    answer: 'To play the game.',
    href: 'https://x.com/RealTBAlexander',
  },
  {
    id: 1,
    question: 'Does anyone Really know what they are doing? Like Really?',
    answer: 'Probably not.',
    href: 'https://www.explainxkcd.com/wiki/index.php/2347:_Dependency',
  },
  {
    id: 1,
    question: 'What is the Greatest Western ever Written',
    answer: 'This one.',
    href: 'https://www.amazon.com/Ride-Dark-Trail-Sacketts-Novel/dp/0553276824',
  },
  {
    id: 1,
    question: 'Can the Guy who built the website, recite sections of the above mentioned book more than anyone else in the world.',
    answer: 'If someone else can they aren`t telling anyone about it.',
    href: 'https://www.amazon.com/Ride-Dark-Trail-Sacketts-Novel/dp/0553276824',
  },
  
];
export const footerNavigation = {
  app: [
    { name: 'Login', href: "/login" },
    { name: 'Pricing', href: "/pricing" },
  ],
  company: [
    { name: 'About', href: 'https://www.linkedin.com/in/kendall-tapani-ab5809240' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ],
};
