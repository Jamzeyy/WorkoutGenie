import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="hidden md:block fixed bottom-0 left-20 right-0 bg-dark-900/80 backdrop-blur border-t border-dark-800 py-3 px-6 z-30">
      <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-dark-500">
        <p>© {new Date().getFullYear()} WorkoutGenie. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/terms" className="hover:text-dark-300 transition-colors">
            Terms of Service
          </Link>
          <Link to="/privacy" className="hover:text-dark-300 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/pricing" className="hover:text-dark-300 transition-colors">
            Pricing
          </Link>
        </div>
      </div>
    </footer>
  );
}
