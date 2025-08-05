import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/axios';
import { motion } from 'framer-motion';
import { FaDownload, FaArrowRight, FaStar, FaCalendar, FaClock, FaExternalLinkAlt, FaGithub, FaEye, FaRocket, FaBrain, FaPen } from 'react-icons/fa';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ResumeDownload from '../components/ResumeDownload';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Refs for GSAP animations
  const homeRef = useRef(null);
  const heroRef = useRef(null);
  const profileImageRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroNameRef = useRef(null);
  const heroRoleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroButtonsRef = useRef(null);
  const viewProjectsButtonRef = useRef(null);
  const resumeButtonRef = useRef(null);
  const badgeRef = useRef(null);
  const downloadButtonRef = useRef(null);
  const downloadIconRef = useRef(null);
  const downloadTextRef = useRef(null);
  const skillsSectionRef = useRef(null);
  const projectsSectionRef = useRef(null);
  const blogsSectionRef = useRef(null);
  const testimonialsSectionRef = useRef(null);
  const ctaSectionRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      initializeAnimations();
    }
  }, [loading]);

  const fetchData = async () => {
    try {
      const [testimonialsResponse, projectsResponse, blogsResponse, skillsResponse] = await Promise.all([
        api.get('/testimonials/'),
        api.get('/projects/'),
        api.get('/blogs/'),
        api.get('/skills/')
      ]);

      const testimonialsData = testimonialsResponse.data;
      const testimonialsArray = Array.isArray(testimonialsData)
        ? testimonialsData
        : testimonialsData.results || [];
      const projectsData = projectsResponse.data;
      console.log('projectsData:', projectsData);
      const projectsArray = Array.isArray(projectsData)
        ? projectsData
        : projectsData.results || [];
      const blogsData = blogsResponse.data;
      const blogsArray = Array.isArray(blogsData)
        ? blogsData
        : blogsData.results || [];
      const skillsData = skillsResponse.data;
      console.log('skillsData:', skillsData);
      const skillsArray = Array.isArray(skillsData)
        ? skillsData
        : skillsData.results || [];
      console.log('skillsArray:', skillsArray);

      setTestimonials(testimonialsArray.filter(testimonial => testimonial.approved));
      setFeaturedProjects(projectsArray.filter(project => project.featured).slice(0, 3));
      setRecentBlogs(blogsArray.filter(blog => blog.published).slice(0, 3));
      setSkills(skillsArray);
    } catch (error) {
      setTestimonials([]);
      setFeaturedProjects([]);
      setRecentBlogs([]);
      setSkills([]);
      setError('Error loading data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeAnimations = () => {
    // Set initial states
    gsap.set([heroTextRef.current, profileImageRef.current, badgeRef.current, heroNameRef.current, heroRoleRef.current, heroSubtitleRef.current, heroButtonsRef.current], {
      opacity: 0,
      y: 50
    });

    // Set initial states for individual buttons
    gsap.set([viewProjectsButtonRef.current, resumeButtonRef.current], {
      opacity: 0,
      scale: 0.8,
      y: 30
    });

    // Main timeline for hero section
    const heroTimeline = gsap.timeline({ delay: 0.2 });

    // Animate badge
    heroTimeline.to(badgeRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)"
    })
    // Animate hero name with typewriter effect
    .to(heroNameRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.2")
    // Animate hero role
    .to(heroRoleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4")
    // Animate hero subtitle
    .to(heroSubtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4")
    // Animate hero buttons container
    .to(heroButtonsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4")
    // Animate individual buttons with stagger
    .to([viewProjectsButtonRef.current, resumeButtonRef.current], {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: "back.out(1.4)"
    }, "-=0.4")
    // Animate hero text container
    .to(heroTextRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=1.2")
    // Animate profile image
    .to(profileImageRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.2)"
    }, "-=0.6");

    // Floating animation for profile image
    gsap.to(profileImageRef.current, {
      y: -10,
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });

    // Hero buttons hover animations
    if (viewProjectsButtonRef.current) {
      const button = viewProjectsButtonRef.current;
      const icon = button.querySelector('.fa-arrow-right, svg');
      
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.05,
          y: -3,
          duration: 0.3,
          ease: "power2.out"
        });
        
        if (icon) {
          gsap.to(icon, {
            x: 5,
            rotation: 15,
            duration: 0.3,
            ease: "back.out(1.7)"
          });
        }
        
        gsap.to(button, {
          boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
          duration: 0.3,
          ease: "power2.out"
        });
      });
      
      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          y: 0,
          boxShadow: "0 0 0px rgba(59, 130, 246, 0)",
          duration: 0.3,
          ease: "power2.out"
        });
        
        if (icon) {
          gsap.to(icon, {
            x: 0,
            rotation: 0,
            duration: 0.3,
            ease: "back.out(1.7)"
          });
        }
      });
      
      button.addEventListener('click', () => {
        gsap.to(button, {
          scale: 0.95,
          duration: 0.1,
          ease: "power2.out",
          yoyo: true,
          repeat: 1
        });
        
        // Ripple effect
        gsap.fromTo(button, 
          { boxShadow: "0 0 0px rgba(59, 130, 246, 0.8)" },
          { 
            boxShadow: "0 0 40px rgba(59, 130, 246, 0)",
            duration: 0.6,
            ease: "power2.out"
          }
        );
      });
    }
    
    // Resume button hover animations (targeting the ResumeDownload component)
    if (resumeButtonRef.current) {
      const resumeButton = resumeButtonRef.current.querySelector('button');
      
      if (resumeButton) {
        const icon = resumeButton.querySelector('svg');
        
        resumeButton.addEventListener('mouseenter', () => {
          gsap.to(resumeButton, {
            scale: 1.05,
            y: -3,
            duration: 0.3,
            ease: "power2.out"
          });
          
          if (icon) {
            gsap.to(icon, {
              y: -2,
              rotation: 360,
              duration: 0.4,
              ease: "back.out(1.7)"
            });
          }
          
          gsap.to(resumeButton, {
            boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)",
            duration: 0.3,
            ease: "power2.out"
          });
        });
        
        resumeButton.addEventListener('mouseleave', () => {
          gsap.to(resumeButton, {
            scale: 1,
            y: 0,
            boxShadow: "0 0 0px rgba(99, 102, 241, 0)",
            duration: 0.3,
            ease: "power2.out"
          });
          
          if (icon) {
            gsap.to(icon, {
              y: 0,
              rotation: 0,
              duration: 0.4,
              ease: "back.out(1.7)"
            });
          }
        });
        
        resumeButton.addEventListener('click', () => {
          gsap.to(resumeButton, {
            scale: 0.95,
            duration: 0.1,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
          });
          
          // Ripple effect
          gsap.fromTo(resumeButton, 
            { boxShadow: "0 0 0px rgba(99, 102, 241, 0.8)" },
            { 
              boxShadow: "0 0 40px rgba(99, 102, 241, 0)",
              duration: 0.6,
              ease: "power2.out"
            }
          );
        });
      }
    }

    // Skills section animations
    if (skillsSectionRef.current) {
      const skillCards = skillsSectionRef.current.querySelectorAll('.skill-card');
      
      gsap.fromTo(skillCards, 
        {
          opacity: 0,
          y: 30,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: skillsSectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Add hover animations for skill cards
      skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.05,
            y: -5,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });
    }

    // Projects section animations
    if (projectsSectionRef.current) {
      const projectCards = projectsSectionRef.current.querySelectorAll('.project-card');
      
      gsap.fromTo(projectCards,
        {
          opacity: 0,
          y: 40,
          rotationX: 15
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: projectsSectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Add hover animations for project cards
      projectCards.forEach(card => {
        const image = card.querySelector('img');
        
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -10,
            scale: 1.02,
            duration: 0.4,
            ease: "power2.out"
          });
          
          if (image) {
            gsap.to(image, {
              scale: 1.1,
              duration: 0.4,
              ease: "power2.out"
            });
          }
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out"
          });
          
          if (image) {
            gsap.to(image, {
              scale: 1,
              duration: 0.4,
              ease: "power2.out"
            });
          }
        });
      });
    }

    // Blog section animations
    if (blogsSectionRef.current) {
      const blogCards = blogsSectionRef.current.querySelectorAll('.blog-card');
      
      gsap.fromTo(blogCards,
        {
          opacity: 0,
          x: -30,
          rotation: -2
        },
        {
          opacity: 1,
          x: 0,
          rotation: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: blogsSectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Add hover animations for blog cards
      blogCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -8,
            rotation: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });
    }

    // Testimonials section animations
    if (testimonialsSectionRef.current) {
      const testimonialCards = testimonialsSectionRef.current.querySelectorAll('.testimonial-card');
      
      gsap.fromTo(testimonialCards,
        {
          opacity: 0,
          scale: 0.8,
          y: 30
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: testimonialsSectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Add hover animations for testimonial cards
      testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.03,
            y: -5,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });
    }

    // CTA section animations
    if (ctaSectionRef.current) {
      gsap.fromTo(ctaSectionRef.current,
        {
          opacity: 0,
          scale: 0.9,
          y: 50
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: ctaSectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Section headers animations
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
      gsap.fromTo(header,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Download button animations
    if (downloadButtonRef.current) {
      // Initial entrance animation
      gsap.fromTo(downloadButtonRef.current, 
        { 
          opacity: 0, 
          y: 30, 
          scale: 0.8,
          rotation: -5
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          rotation: 0,
          duration: 0.8,
          delay: 1.8,
          ease: "back.out(1.7)"
        }
      );

      // Hover animations
      const button = downloadButtonRef.current;
      const icon = downloadIconRef.current;
      const text = downloadTextRef.current;

      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        });
        
        gsap.to(icon, {
          y: -2,
          rotation: 360,
          duration: 0.4,
          ease: "back.out(1.7)"
        });
        
        gsap.to(text, {
          y: -1,
          duration: 0.3,
          ease: "power2.out"
        });

        gsap.to(button, {
          boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)",
          duration: 0.3,
          ease: "power2.out"
        });
      });

      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          boxShadow: "0 0 0px rgba(99, 102, 241, 0)",
          duration: 0.3,
          ease: "power2.out"
        });
        
        gsap.to(icon, {
          y: 0,
          rotation: 0,
          duration: 0.4,
          ease: "back.out(1.7)"
        });
        
        gsap.to(text, {
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      button.addEventListener('click', () => {
        gsap.to(button, {
          scale: 0.95,
          duration: 0.1,
          ease: "power2.out",
          yoyo: true,
          repeat: 1
        });

        gsap.to(icon, {
          y: -5,
          scale: 1.2,
          duration: 0.2,
          ease: "back.out(1.7)",
          yoyo: true,
          repeat: 1
        });

        gsap.to(text, {
          x: [-2, 2, -2, 2, 0],
          duration: 0.3,
          ease: "power2.out"
        });

        gsap.to(button, {
          boxShadow: "0 0 50px rgba(99, 102, 241, 0.8)",
          duration: 0.2,
          ease: "power2.out",
          yoyo: true,
          repeat: 1
        });
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSkillIcon = (skillName) => {
    const iconMap = {
      'python': '🐍',
      'django': '⚡',
      'react': '⚛️',
      'tailwind': '🎨',
      'node.js': '🟢',
      'github': '🐙',
      'javascript': '📜',
      'html': '🌐',
      'css': '🎨',
      'sql': '🗄️',
      'postgresql': '🐘',
      'mongodb': '🍃',
      'docker': '🐳',
      'aws': '☁️',
      'git': '📝'
    };
    
    const lowerName = skillName.toLowerCase();
    return iconMap[lowerName] || '💻';
  };

  const getTimeToRead = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Error Loading Data</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={homeRef} className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left: Intro */}
            <div ref={heroTextRef} className="flex-1 flex flex-col items-start justify-center gap-6 text-center lg:text-left opacity-0">
              {/* <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-4 opacity-0">
                <Sparkles className="w-4 h-4" />
                Welcome to my portfolio
              </div> */}
              <h1 ref={heroTitleRef} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                <span ref={heroNameRef}>{t('hero.greeting')} <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">{t('hero.name')}</span></span>
                <br />
                <span ref={heroRoleRef} className="text-3xl sm:text-4xl lg:text-5xl">{t('hero.title')}</span>
              </h1>
              <p ref={heroSubtitleRef} className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <div ref={heroButtonsRef} className="flex flex-col sm:flex-row gap-4 mt-6 w-full max-w-md mx-auto lg:mx-0 justify-center items-center">
                <Link 
                  ref={viewProjectsButtonRef}
                  to="/projects" 
                  className="flex-1 text-center bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-2 border-white/30 dark:border-gray-700/30 text-gray-900 dark:text-gray-100 px-8 py-4 rounded-2xl shadow-xl hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 transform hover:scale-105 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2"
                >
                  {t('projects.viewAll')}
                  <FaArrowRight className="w-5 h-5" />
                </Link>
                <div ref={resumeButtonRef} className="flex-1">
                  <ResumeDownload />
                </div>
              </div>
            </div>
          
            {/* Right: Profile Image */}
            <div ref={profileImageRef} className="flex-1 flex items-center justify-center mb-6 lg:mb-0 opacity-0">
              <div className="relative">
                <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center relative">
                  <img
                    src="/src/assets/profile.png"
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div ref={skillsSectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="section-header text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Tech <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Stack</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Technologies and tools I use to build amazing applications
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {skills.length > 0 ? (
            skills.slice(0, 6).map((skill, idx) => (
              <div
                key={skill.id}
                className="skill-card group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/50 cursor-pointer"
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {skill.icon || getSkillIcon(skill.name)}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-semibold text-center">
                    {skill.name}
                  </span>
                  {skill.proficiency && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            [
              { name: 'Python', icon: '🐍' },
              { name: 'Django', icon: '⚡' },
              { name: 'React', icon: '⚛️' },
              { name: 'Tailwind', icon: '🎨' },
              { name: 'Node.js', icon: '🟢' },
              { name: 'GitHub', icon: '🐙' }
            ].map((tech, idx) => (
              <div
                key={idx}
                className="skill-card group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/50 cursor-pointer"
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {tech.icon}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-semibold text-center">
                    {tech.name}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="text-center mt-12">
          <Link
            to="/skills"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-lg font-semibold transition-colors"
          >
            View All Skills
            <FaArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <div ref={projectsSectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="section-header text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Featured <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Projects</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Here are some of my recent projects that showcase my skills and creativity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <div
                key={project.id}
                className="project-card group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/50"
              >
                {project.image_url && (
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                        Featured
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex gap-3">
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white text-center py-2 px-4 rounded-xl hover:from-gray-900 hover:to-black dark:hover:from-gray-800 dark:hover:to-gray-900 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <FaGithub className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {project.live_demo_link && (
                      <a
                        href={project.live_demo_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <FaExternalLinkAlt className="w-4 h-4" />
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              View All Projects
              <FaArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}

      {/* Recent Blog Posts */}
      {recentBlogs.length > 0 && (
        <div ref={blogsSectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="section-header text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Latest <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Blog Posts</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Thoughts, insights, and experiences from my journey in software development.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentBlogs.map((blog, index) => (
              <div
                key={blog.id}
                className="blog-card group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/50"
              >
                {blog.image_url && (
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {blog.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FaCalendar className="w-4 h-4" />
                      {formatDate(blog.created_at)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FaClock className="w-4 h-4" />
                      {getTimeToRead(blog.content)}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {blog.excerpt || blog.content.substring(0, 120) + '...'}
                  </p>
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors group-hover:gap-3"
                  >
                    Read More
                    <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Read All Posts
              <FaArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <div ref={testimonialsSectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="section-header text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              What People <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Say</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Testimonials from clients and colleagues I've had the pleasure of working with.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="testimonial-card group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/50"
              >
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 text-2xl">
                    {'★'.repeat(testimonial.rating || 5)}{'☆'.repeat(5 - (testimonial.rating || 5))}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  {testimonial.image_url ? (
                    <img 
                      src={testimonial.image_url} 
                      alt={`${testimonial.name}'s profile`} 
                      className="w-12 h-12 object-cover rounded-full mr-4 border-2 border-gray-200 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-semibold text-lg">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {testimonial.name}
                    </h4>
                    {testimonial.position && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {testimonial.position}
                      </p>
                    )}
                    {testimonial.company && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {testimonial.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div
          ref={ctaSectionRef}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-center shadow-2xl"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's work together to bring your ideas to life. I'm here to help you create something amazing.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Get Started Today
            <FaArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;