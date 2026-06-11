import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    window.addEventListener("resize", handleResize)
    // Initialize immediately without triggering the strict mode effect error easily
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}
