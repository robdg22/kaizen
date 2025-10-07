export default function Footer() {
  // Get version from package.json or use a timestamp
  const version = import.meta.env.VITE_APP_VERSION || '1.0.0'
  const buildTime = import.meta.env.VITE_BUILD_TIME || new Date().toISOString().split('T')[0]
  
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-4 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <div className="text-sm text-gray-600">
          <p>© 2024 Tesco. All rights reserved.</p>
        </div>
        <div className="text-xs text-gray-500 flex flex-col sm:flex-row items-center gap-1 sm:gap-4">
          <span>Version: {version}</span>
          <span>Build: {buildTime}</span>
          <span>Branch: {import.meta.env.VITE_GIT_BRANCH || 'main'}</span>
          <span>Commit: {import.meta.env.VITE_GIT_COMMIT || 'unknown'}</span>
        </div>
      </div>
    </footer>
  )
}
