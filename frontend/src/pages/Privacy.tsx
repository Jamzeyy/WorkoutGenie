import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-dark-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose prose-invert max-w-none"
      >
        <h1 className="text-3xl font-display text-white mb-2">Privacy Policy</h1>
        <p className="text-dark-400 mb-8">Last updated: January 2026</p>

        <div className="space-y-8 text-dark-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              WorkoutGenie ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you use our fitness application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
            
            <h3 className="text-lg font-medium text-white mt-4 mb-2">Personal Information</h3>
            <p>When you create an account, we collect:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Email address</li>
              <li>Name (optional)</li>
              <li>Password (stored securely hashed)</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4 mb-2">Health & Fitness Data</h3>
            <p>To personalize your experience, you may provide:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Height and weight</li>
              <li>Age and gender</li>
              <li>Fitness goals and activity level</li>
              <li>Workout history and progress</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4 mb-2">Usage Data</h3>
            <p>We automatically collect:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Device and browser information</li>
              <li>IP address</li>
              <li>Pages visited and features used</li>
              <li>Time spent on the application</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide and maintain our Service</li>
              <li>Generate personalized AI workout plans</li>
              <li>Track your fitness progress</li>
              <li>Process payments and subscriptions</li>
              <li>Send important notifications about your account</li>
              <li>Improve our Service and develop new features</li>
              <li>Respond to customer support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Data Sharing</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong className="text-white">Paddle:</strong> Our payment processor, for subscription management</li>
              <li><strong className="text-white">OpenAI:</strong> To generate personalized workout plans (only fitness-related data)</li>
              <li><strong className="text-white">Analytics providers:</strong> To understand usage patterns (anonymized)</li>
              <li><strong className="text-white">Legal authorities:</strong> When required by law</li>
            </ul>
            <p className="mt-2">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your data, including:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Encryption of data in transit (HTTPS)</li>
              <li>Secure password hashing</li>
              <li>Regular security assessments</li>
              <li>Limited access to personal data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
              <li><strong className="text-white">Correction:</strong> Update or correct your information</li>
              <li><strong className="text-white">Deletion:</strong> Request deletion of your account and data</li>
              <li><strong className="text-white">Export:</strong> Download your workout data (Pro feature)</li>
              <li><strong className="text-white">Opt-out:</strong> Unsubscribe from marketing communications</li>
            </ul>
            <p className="mt-2">
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@workoutgenie.app" className="text-genie-400 hover:text-genie-300">
                privacy@workoutgenie.app
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Keep you signed in</li>
              <li>Remember your preferences</li>
              <li>Analyze how you use our Service</li>
            </ul>
            <p className="mt-2">
              You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active. 
              After account deletion, we may retain certain data for up to 30 days for backup purposes, 
              and anonymized data may be retained for analytics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Children's Privacy</h2>
            <p>
              Our Service is not intended for users under 16 years of age. 
              We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. International Data Transfers</h2>
            <p>
              Your data may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any 
              significant changes by email or through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none mt-2 space-y-1">
              <li>
                Email:{' '}
                <a href="mailto:privacy@workoutgenie.app" className="text-genie-400 hover:text-genie-300">
                  privacy@workoutgenie.app
                </a>
              </li>
            </ul>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
