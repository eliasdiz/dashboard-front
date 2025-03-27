"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogIn, UserPlus, Sparkles, BarChart3, Globe, Shield } from 'lucide-react';
import { AnimatedBackground } from "@/components/animated-background";
import { AnimatedLogo } from "@/components/animated-logo";

export function LandingPage() {
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;


  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-8">
        <div className="max-w-5xl w-full mx-auto flex flex-col items-center">
          {/* Logo and Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <AnimatedLogo />
          </motion.div>
          
          {/* Main Heading */}
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold text-center mb-4"
          >
            <span className="bg-clip-text text-transparent bg-google-gradient">
              Manage Your Business Presence
            </span>
          </motion.h1>
          
          {/* Tagline */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-center text-muted-foreground mb-12 max-w-3xl"
          >
            Streamline your marketing, manage users, and grow your business with our all-in-one platform
          </motion.p>
          
          {/* Feature List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-3xl w-full"
          >
            <FeatureItem 
              icon={<Globe className="h-5 w-5 text-primary" />}
              title="Marketing Management"
              delay={0.8}
            />
            <FeatureItem 
              icon={<Shield className="h-5 w-5 text-destructive" />}
              title="User Permissions"
              delay={0.9}
            />
            <FeatureItem 
              icon={<BarChart3 className="h-5 w-5 text-secondary" />}
              title="Analytics Dashboard"
              delay={1.0}
            />
            <FeatureItem 
              icon={<Sparkles className="h-5 w-5 text-muted" />}
              title="Business Optimization"
              delay={1.1}
            />
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <Link href="/login" passHref>
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-lg px-8 py-6"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Login <LogIn className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <motion.div 
                  className="absolute inset-0 bg-primary-foreground/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </Link>
            <Link href="/signup" passHref>
              <Button 
                size="lg" 
                variant="outline" 
                className="group relative overflow-hidden border-2 border-primary hover:border-primary/80 text-lg px-8 py-6"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Register <UserPlus className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <motion.div 
                  className="absolute inset-0 bg-primary/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </Link>
          </motion.div>
        </div>
        
        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="absolute bottom-6 w-full flex justify-between items-center px-6 md:px-12"
        >
          <div className="text-sm text-muted-foreground">
            © 2025 Business Manager. All rights reserved.
          </div>
          <ThemeToggle />
        </motion.div>
      </div>
    </div>
  );
}

// Feature Item Component
function FeatureItem({ icon, title, delay }: { icon: React.ReactNode, title: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center gap-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border"
    >
      <div className="flex-shrink-0 p-2 rounded-full bg-background">
        {icon}
      </div>
      <span className="font-medium">{title}</span>
    </motion.div>
  );
}
