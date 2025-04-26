export const Footer = () => {
  const getCurrentAcademicYear = () => {
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()

    if (currentMonth >= 7) {
      return `${currentYear}-${currentYear + 1}`
    }

    return `${currentYear - 1}-${currentYear}`
  }

  return (
    <footer className="z-20 w-full border-border/40 border-t bg-[#3D3A24] shadow-sm backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-end px-4 sm:px-8">
        <p className="text-white text-xs sm:text-sm">
          All rights reserved @ SSC A.Y. {getCurrentAcademicYear()}
        </p>
      </div>
    </footer>
  )
}
