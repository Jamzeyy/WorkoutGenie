import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
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
        <h1 className="text-3xl font-display text-white mb-2">Terms of Service</h1>
        <p className="text-dark-400 mb-8">Last updated: January 2026</p>

        <div className="space-y-8 text-dark-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using WorkoutGenie ("the Service"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>
              WorkoutGenie is a fitness application that provides AI-powered workout plan generation, 
              workout tracking, and fitness guidance. The Service includes both free and paid subscription tiers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
            <p>
              To use certain features of the Service, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Subscriptions and Payments</h2>
            <p>
              WorkoutGenie offers subscription plans with the following terms:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Payments are processed securely through Paddle, our merchant of record</li>
              <li>Subscriptions automatically renew unless cancelled before the renewal date</li>
              <li>You may cancel your subscription at any time through your account settings</li>
              <li>Refunds are handled in accordance with Paddle's refund policy</li>
              <li>Prices may change with 30 days notice to active subscribers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Use the Service for any unlawful purpose</li>
              <li>Share your account with others</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Reproduce, duplicate, or resell any part of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Health Disclaimer</h2>
            <p>
              <strong className="text-white">Important:</strong> WorkoutGenie provides general fitness information and AI-generated workout suggestions. 
              This is not medical advice. Before starting any exercise program, you should:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Consult with a qualified healthcare provider</li>
              <li>Consider your current health status and any medical conditions</li>
              <li>Stop exercising immediately if you experience pain, dizziness, or discomfort</li>
            </ul>
            <p className="mt-2">
              We are not responsible for any injuries or health issues that may result from following workout plans or advice provided through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by WorkoutGenie 
              and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, WorkoutGenie shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages resulting from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of significant 
              changes via email or through the Service. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              <a href="mailto:support@workoutgenie.app" className="text-genie-400 hover:text-genie-300">
                support@workoutgenie.app
              </a>
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
