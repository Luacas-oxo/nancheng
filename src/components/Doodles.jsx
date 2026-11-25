// 手绘风 SVG 小部件：贴纸、箭头、星星、闪电、笑脸
export const Spark = ({ size = 28, color = '#FFCE00', className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path
      d="M16 1.5c1.4 7.4 4.4 10.4 11.8 11.8-7.4 1.4-10.4 4.4-11.8 11.8C14.6 17.7 11.6 14.7 4.2 13.3 11.6 11.9 14.6 8.9 16 1.5Z"
      fill={color}
      stroke="#0F0F0F"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
)

export const Star5 = ({ size = 34, color = '#F5452F', className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path
      d="M20 2l4.6 11.6 12.4.9-9.5 8 3.1 12-10.6-6.6-10.6 6.7 3-12-9.5-8.1 12.4-.8L20 2Z"
      fill={color}
      stroke="#0F0F0F"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
  </svg>
)

export const Bolt = ({ size = 26, color = '#FFCE00', className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 32" fill="none">
    <path
      d="M15 2 3 19h7l-2 11 12-17h-7l2-11Z"
      fill={color}
      stroke="#0F0F0F"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
  </svg>
)

export const Smiley = ({ size = 46, color = '#FFCE00', className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="20" fill={color} stroke="#0F0F0F" strokeWidth="3" />
    <circle cx="17" cy="20" r="2.6" fill="#0F0F0F" />
    <circle cx="31" cy="20" r="2.6" fill="#0F0F0F" />
    <path d="M13 27c3 7 19 7 22 0" stroke="#0F0F0F" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
)

export const CurlArrow = ({ size = 120, color = '#F5452F', className = '' }) => (
  <svg className={className} width={size} height={size * 0.5} viewBox="0 0 160 80" fill="none">
    <path
      d="M6 14c26 44 52 56 92 52 20-2 32-10 26-24-5-11-24-10-30 4-4 11 6 16 18 12"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M132 26c-4-12-8-18-13-24M132 26c-12 2-20 3-28 3"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
)

export const Squiggle = ({ width = 220, color = '#0F0F0F', className = '' }) => (
  <svg className={className} width={width} height={width * 0.13} viewBox="0 0 220 28" fill="none">
    <path
      d="M2 20c14-16 26 6 40-8s26 16 40 2 26-14 40-4 26 14 40 0 34-10 56-2"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
)

export const Eye = ({ size = 24, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" stroke="#0F0F0F" strokeWidth="2.4" />
    <circle cx="12" cy="12" r="3.2" fill="#0F0F0F" />
  </svg>
)

export const ArrowRight = ({ size = 20, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 12h17M14 5l7 7-7 7" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ArrowDown = ({ size = 18, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 3v17M5 13l7 7 7-7" stroke={stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const MailIcon = ({ size = 22, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" stroke={stroke} strokeWidth="2.4" />
    <path d="M4 7l8 6 8-6" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" />
  </svg>
)

export const CopyIcon = ({ size = 18, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="8" y="8" width="13" height="13" rx="2.5" stroke={stroke} strokeWidth="2.2" />
    <path d="M16 6V4.5A1.5 1.5 0 0014.5 3h-9A1.5 1.5 0 004 4.5v9A1.5 1.5 0 005.5 18H6" stroke={stroke} strokeWidth="2.2" />
  </svg>
)

export const CheckIcon = ({ size = 18, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 13l5 5L20 6" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const PlayIcon = ({ size = 20, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M7 3.5 20 12 7 20.5V3.5Z" fill={stroke} />
  </svg>
)

export const Sunburst = ({ size = 120, color = '#FFCE00', className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 120 120" fill="none">
    {Array.from({ length: 16 }).map((_, i) => (
      <rect
        key={i}
        x="58"
        y={i % 2 ? 4 : 10}
        width="4"
        height={i % 2 ? 14 : 22}
        rx="2"
        fill={color}
        transform={`rotate(${i * 22.5} 60 60)`}
      />
    ))}
    <circle cx="60" cy="60" r="16" fill="none" stroke={color} strokeWidth="4" />
  </svg>
)
