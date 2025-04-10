// Sample image URLs from Pexels (free to use)
const sampleImages = [
    'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
    'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg',
    'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
    'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg'
];

const toneTemplates = {
    professional: {
        headlines: [
            "Transform Your Business Today",
            "Elevate Your Professional Success",
            "Innovation Meets Excellence"
        ],
        subheadlines: [
            "Expert solutions tailored to your needs",
            "Achieve more with industry-leading technology",
            "Streamline your operations with proven methods"
        ],
        ctas: [
            "Learn More",
            "Get Started",
            "Schedule a Consultation"
        ]
    },
    casual: {
        headlines: [
            "Ready for Something Amazing?",
            "Let's Make Magic Happen",
            "Your Journey Starts Here"
        ],
        subheadlines: [
            "Join thousands of happy customers",
            "Discover what's possible with us",
            "Simple solutions for everyday needs"
        ],
        ctas: [
            "Join Now",
            "Try It Out",
            "Get Started"
        ]
    },
    playful: {
        headlines: [
            "Get Ready for Awesome! 🚀",
            "Time to Have Some Fun! ✨",
            "Let's Create Something Cool! 🎨"
        ],
        subheadlines: [
            "Because boring is so yesterday",
            "Join the fun and see what happens",
            "Adventure awaits around every corner"
        ],
        ctas: [
            "Let's Go!",
            "Jump In!",
            "Start the Fun!"
        ]
    },
    luxury: {
        headlines: [
            "Experience Unparalleled Excellence",
            "Discover True Luxury",
            "Elevate Your Lifestyle"
        ],
        subheadlines: [
            "Crafted for those who demand the finest",
            "Where luxury meets exceptional quality",
            "Exclusive offerings for discerning individuals"
        ],
        ctas: [
            "Explore Collection",
            "Reserve Now",
            "Discover More"
        ]
    },
    technical: {
        headlines: [
            "Optimize Your Performance",
            "Advanced Solutions for Complex Needs",
            "Engineering the Future"
        ],
        subheadlines: [
            "Leveraging cutting-edge technology",
            "Data-driven solutions for measurable results",
            "Precision-engineered for optimal performance"
        ],
        ctas: [
            "View Specifications",
            "Start Implementation",
            "Learn More"
        ]
    }
};

const formatTemplates = {
    social_media: {
        dimensions: "1200x628",
        style: "Bold, eye-catching visuals with concise text"
    },
    banner: {
        dimensions: "728x90",
        style: "Horizontal layout with clear CTA"
    },
    email: {
        dimensions: "600x200",
        style: "Clean, professional design with detailed content"
    }
};

const generateAd = async (adData) => {
    try {
        const { brandGuidelines, format } = adData;
        const tone = brandGuidelines.tone || 'professional';
        const toneTemplate = toneTemplates[tone];
        
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate multiple variations
        const variations = Array.from({ length: 3 }, (_, index) => {
            const headlineIndex = Math.floor(Math.random() * toneTemplate.headlines.length);
            const subheadlineIndex = Math.floor(Math.random() * toneTemplate.subheadlines.length);
            const ctaIndex = Math.floor(Math.random() * toneTemplate.ctas.length);
            const imageIndex = Math.floor(Math.random() * sampleImages.length);

            return {
                id: `ad_${Date.now()}_${index}`,
                headline: toneTemplate.headlines[headlineIndex],
                subheadline: toneTemplate.subheadlines[subheadlineIndex],
                cta: toneTemplate.ctas[ctaIndex],
                imageUrl: sampleImages[imageIndex],
                format: format || 'social_media',
                style: {
                    colors: brandGuidelines.colors || ['#007bff', '#ffffff'],
                    tone: tone,
                    dimensions: formatTemplates[format || 'social_media'].dimensions
                },
                metadata: {
                    targetAudience: brandGuidelines.targetAudience,
                    brandStyle: brandGuidelines.style,
                    generatedAt: new Date().toISOString()
                }
            };
        });

        return variations;

    } catch (error) {
        console.error('Error in AI service:', error);
        throw new Error('Failed to generate advertisement');
    }
};

module.exports = {
    generateAd
};
