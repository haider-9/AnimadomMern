import { Link } from "react-router"
import { Button } from "~/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <img
        src="/404.png"
        alt="404 Not Found"
        width={400}
        height={400}
        
      />
      <h1 className="mt-8 text-4xl font-bold">Page Not Found</h1>
      <p className="mt-4 text-gray-600 mb-8">The page you are looking for does not exist.</p>
      <Link to="/">
        <Button size="lg">
          Return Home
        </Button>
      </Link>
    </div>
  )
}