import { useState } from "react";
import { motion } from "motion/react";
import { Check, Star, Sparkles, Building2, Users, Zap } from "lucide-react";

interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  popular?: boolean;
  icon: typeof Building2;
  features: string[];
  cta: string;
  highlight?: boolean;
}

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const plans: PricingPlan[] = [
    {
      name: "Starter",
      description: "Perfect for individual students looking for their first dorm",
      monthlyPrice: 0,
      annualPrice: 0,
      icon: Users,
      features: [
        "Browse all verified dormitories",
        "Basic roommate matching",
        "View dorm details and photos",
        "Contact dorm owners",
        "Payment reminders",
        "Community access"
      ],
      cta: "Get Started Free"
    },
    {
      name: "Professional",
      description: "Best for dorm owners managing multiple properties",
      monthlyPrice: 499,
      annualPrice: 4990,
      popular: true,
      icon: Building2,
      features: [
        "Everything in Starter",
        "List up to 5 properties",
        "Advanced tenant management",
        "Maintenance request system",
        "Payment tracking & reminders",
        "Analytics dashboard",
        "Priority support",
        "Custom branding"
      ],
      cta: "Start Free Trial",
      highlight: true
    },
    {
      name: "Enterprise",
      description: "For property management companies and institutions",
      monthlyPrice: 1499,
      annualPrice: 14990,
      icon: Zap,
      features: [
        "Everything in Professional",
        "Unlimited property listings",
        "Multi-user accounts",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 priority support",
        "White-label solution",
        "Advanced reporting"
      ],
      cta: "Contact Sales"
    }
  ];

  const getPrice = (plan: PricingPlan) => {
    return billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
  };

  const getSavings = () => {
    return billingPeriod === 'annual' ? 'Save 17%' : '';
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-[#99f6e4]/50 text-[#115e59] dark:text-[#5eead4] rounded-full text-sm mb-4 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-[#0d9488]" />
            <span className="font-medium">Simple, transparent pricing</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0d9488] to-[#115e59] bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span className={`text-sm font-medium transition-colors ${billingPeriod === 'monthly' ? 'text-[#134e4a] dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            Monthly
          </span>
          
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
            className="relative w-14 h-7 backdrop-blur-xl bg-white/60 dark:bg-gray-700/60 border-2 border-[#99f6e4]/50 dark:border-[#0f766e]/50 rounded-full transition-all duration-300 hover:border-[#14b8a6]"
          >
            <motion.div
              layout
              className="absolute top-0.5 w-5 h-5 bg-gradient-to-r from-[#14b8a6] to-[#0f766e] rounded-full shadow-md"
              animate={{
                x: billingPeriod === 'monthly' ? 2 : 26
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>

          <span className={`text-sm font-medium transition-colors ${billingPeriod === 'annual' ? 'text-[#134e4a] dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            Annual
          </span>

          {billingPeriod === 'annual' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="px-3 py-1 bg-gradient-to-r from-[#14b8a6] to-[#0f766e] text-white text-xs font-semibold rounded-full shadow-lg"
            >
              {getSavings()}
            </motion.span>
          )}
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = getPrice(plan);
            const isPopular = plan.popular;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: isPopular ? -8 : 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ 
                  y: isPopular ? -12 : -4,
                  transition: { duration: 0.2 }
                }}
                className={`relative backdrop-blur-3xl rounded-3xl border shadow-xl transition-all ${
                  isPopular 
                    ? 'bg-white/90 dark:bg-gray-800/90 border-[#14b8a6]/50 shadow-2xl shadow-[#14b8a6]/20 lg:scale-105' 
                    : 'bg-white/70 dark:bg-gray-800/70 border-[#99f6e4]/50 dark:border-[#0f766e]/50 hover:border-[#14b8a6]/30'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                  >
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#14b8a6] to-[#0f766e] px-4 py-1.5 rounded-full text-white font-semibold text-sm shadow-lg">
                      <Star className="w-4 h-4 fill-white" />
                      Most Popular
                    </div>
                  </motion.div>
                )}

                <div className="p-8">
                  {/* Plan Icon & Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                      isPopular 
                        ? 'bg-gradient-to-br from-[#14b8a6] to-[#0f766e]' 
                        : 'bg-gradient-to-br from-[#99f6e4] to-[#5eead4]'
                    }`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#134e4a] dark:text-white">{plan.name}</h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 min-h-[40px]">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <motion.span
                        key={`${plan.name}-${billingPeriod}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold bg-gradient-to-r from-[#0d9488] to-[#115e59] bg-clip-text text-transparent"
                      >
                        ₱{price.toLocaleString()}
                      </motion.span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </div>
                    {price > 0 && billingPeriod === 'annual' && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Billed annually (₱{Math.round(price / 12).toLocaleString()}/month)
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all shadow-lg mb-6 ${
                      isPopular
                        ? 'bg-gradient-to-r from-[#14b8a6] to-[#0f766e] text-white hover:shadow-xl hover:shadow-[#0d9488]/30'
                        : 'bg-white dark:bg-gray-700 border-2 border-[#99f6e4] dark:border-[#0f766e] text-[#115e59] dark:text-[#5eead4] hover:border-[#14b8a6] hover:bg-[#f0fdfa] dark:hover:bg-gray-600'
                    }`}
                  >
                    {plan.cta}
                  </motion.button>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-[#99f6e4] dark:via-[#0f766e] to-transparent mb-6" />

                  {/* Features List */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                      What's included
                    </p>
                    {plan.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + idx * 0.05, duration: 0.3 }}
                        className="flex items-start gap-3"
                      >
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                          isPopular 
                            ? 'bg-gradient-to-br from-[#14b8a6] to-[#0f766e]' 
                            : 'bg-[#ccfbf1] dark:bg-[#0f766e]/30'
                        }`}>
                          <Check className={`w-3 h-3 ${isPopular ? 'text-white' : 'text-[#0f766e] dark:text-[#5eead4]'}`} />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-[#99f6e4]/50 dark:border-[#0f766e]/50 rounded-2xl p-8 max-w-2xl mx-auto shadow-lg">
            <h3 className="text-2xl font-bold text-[#134e4a] dark:text-white mb-2">
              Not sure which plan is right for you?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Contact our team for a personalized recommendation
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-gradient-to-r from-[#14b8a6] to-[#0f766e] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Talk to Sales
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}