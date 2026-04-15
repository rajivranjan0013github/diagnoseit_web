export function AppStoreButtons({ light = false }) {
  const btnClass = light
    ? "flex items-center gap-3 bg-white text-gray-900 px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
    : "flex items-center gap-3 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-900 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start">
      {/* App Store Button */}
      <a
        href="https://apps.apple.com/us/app/diagnose-it/id6755348303"
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass}
      >
        <AppleIcon className="w-7 h-7" />
        <div className="text-left">
          <p className="text-[10px] opacity-70 font-bold uppercase tracking-wider leading-none">Download on the</p>
          <p className="text-base font-bold leading-tight">App Store</p>
        </div>
      </a>

      {/* Google Play Button */}
      <a
        href="https://play.google.com/store/apps/details?id=com.thousandways.gtd"
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass}
      >
        <GooglePlayIcon className="w-7 h-7" />
        <div className="text-left">
          <p className="text-[10px] opacity-70 font-bold uppercase tracking-wider leading-none">GET IT ON</p>
          <p className="text-base font-bold leading-tight">Google Play</p>
        </div>
      </a>
    </div>
  )
}

function AppleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function GooglePlayIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92z" />
      <path fill="#34A853" d="M16.296 15.504L13.792 12l2.504-3.504 4.476 2.59c.82.474.82 1.354 0 1.828l-4.476 2.59z" />
      <path fill="#FBBC04" d="M3.609 22.186L14.1 15.196l-2.308-3.196-8.183 10.186z" />
      <path fill="#EA4335" d="M3.609 1.814L11.792 12 14.1 8.804 3.609 1.814z" />
    </svg>
  )
}
