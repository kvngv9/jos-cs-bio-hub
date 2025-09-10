// Avatar generation utility
export const generateAvatarFromInitials = (name: string): string => {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  const colors = [
    'hsl(210, 100%, 50%)', // primary
    'hsl(280, 65%, 65%)', // secondary  
    'hsl(142, 76%, 40%)', // success
    'hsl(199, 89%, 52%)', // info
    'hsl(38, 92%, 55%)', // warning
  ];

  const backgroundIndex = name.length % colors.length;
  const backgroundColor = colors[backgroundIndex];

  // Create SVG avatar
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="100" fill="${backgroundColor}"/>
      <text x="100" y="115" text-anchor="middle" font-family="Arial, sans-serif" 
            font-size="60" font-weight="bold" fill="white">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const generateRandomAvatar = (seed: string): string => {
  // Simple pattern-based avatar generator
  const patterns = [
    'circles', 'squares', 'triangles', 'hexagons'
  ];
  
  const colors = [
    ['hsl(210, 100%, 50%)', 'hsl(210, 100%, 70%)'],
    ['hsl(280, 65%, 65%)', 'hsl(280, 65%, 85%)'],
    ['hsl(142, 76%, 40%)', 'hsl(142, 76%, 60%)'],
    ['hsl(199, 89%, 52%)', 'hsl(199, 89%, 72%)'],
    ['hsl(38, 92%, 55%)', 'hsl(38, 92%, 75%)'],
  ];

  const patternIndex = seed.length % patterns.length;
  const colorIndex = seed.charCodeAt(0) % colors.length;
  const [primary, secondary] = colors[colorIndex];

  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#grad)"/>
      ${generatePattern(patterns[patternIndex])}
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const generatePattern = (pattern: string): string => {
  switch (pattern) {
    case 'circles':
      return `
        <circle cx="50" cy="50" r="20" fill="rgba(255,255,255,0.3)"/>
        <circle cx="150" cy="50" r="15" fill="rgba(255,255,255,0.2)"/>
        <circle cx="100" cy="100" r="25" fill="rgba(255,255,255,0.4)"/>
        <circle cx="50" cy="150" r="18" fill="rgba(255,255,255,0.3)"/>
        <circle cx="150" cy="150" r="22" fill="rgba(255,255,255,0.2)"/>
      `;
    case 'squares':
      return `
        <rect x="30" y="30" width="40" height="40" fill="rgba(255,255,255,0.3)"/>
        <rect x="130" y="30" width="30" height="30" fill="rgba(255,255,255,0.2)"/>
        <rect x="80" y="80" width="50" height="50" fill="rgba(255,255,255,0.4)"/>
        <rect x="30" y="130" width="35" height="35" fill="rgba(255,255,255,0.3)"/>
        <rect x="130" y="130" width="45" height="45" fill="rgba(255,255,255,0.2)"/>
      `;
    case 'triangles':
      return `
        <polygon points="50,30 30,70 70,70" fill="rgba(255,255,255,0.3)"/>
        <polygon points="150,40 135,65 165,65" fill="rgba(255,255,255,0.2)"/>
        <polygon points="100,85 75,125 125,125" fill="rgba(255,255,255,0.4)"/>
        <polygon points="50,140 30,175 70,175" fill="rgba(255,255,255,0.3)"/>
        <polygon points="160,135 140,170 180,170" fill="rgba(255,255,255,0.2)"/>
      `;
    default:
      return '';
  }
};