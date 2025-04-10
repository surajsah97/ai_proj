const { generateAd: generateAdService } = require('../utils/aiService');

const generateAd = async (req, res) => {
    try {
        const { 
            referenceAd,
            brandGuidelines,
            format 
        } = req.body;

        // Validate required fields
        if (!brandGuidelines) {
            return res.status(400).json({
                success: false,
                message: 'Brand guidelines are required'
            });
        }

        // Add file path to reference if image was uploaded
        const referenceImage = req.file ? 
            `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : 
            referenceAd?.imageUrl;

        // Prepare data for AI service
        const adData = {
            referenceAd: {
                ...referenceAd,
                imageUrl: referenceImage
            },
            brandGuidelines,
            format
        };

        // Generate ads using AI service
        const generatedAds = await generateAdService(adData);

        // Return generated ads
        res.status(200).json({
            success: true,
            data: generatedAds
        });

    } catch (error) {
        console.error('Error in ad generation:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating advertisement',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

module.exports = {
    generateAd
};
