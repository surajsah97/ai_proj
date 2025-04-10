# AI-Powered Advertisement Generator

An advanced web application that generates on-brand advertisements using AI technology. Upload reference ads and brand guidelines to create fresh, cohesive ad creatives that align with your brand's unique style and messaging.

## Features

- Upload reference advertisements (text and images)
- Define brand guidelines (colors, tone, target audience)
- Generate multiple ad variations
- Support for different ad formats (social media, banner, email)
- Real-time preview and customization
- Download generated ads

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Axios for API calls

### Backend
- Node.js
- Express.js
- Multer for file uploads
- CORS for cross-origin requests

## Project Structure

```
ad-generator/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   └── App.js        # Main application component
│   └── public/           # Static assets
└── server/               # Node.js Backend
    ├── controllers/      # Route controllers
    ├── routes/          # API routes
    ├── utils/           # Utility functions
    └── index.js         # Server entry point
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ad-generator
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../client
npm install
```

### Configuration

1. Create a `.env` file in the server directory:
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. Start the frontend development server:
```bash
cd client
npm start
```

3. Access the application at `http://localhost:3000`

## Usage

1. **Home Page**
   - View service overview and features
   - Navigate to ad creation

2. **Upload Page**
   - Upload reference advertisements
   - Set brand guidelines
   - Choose output format
   - Generate new ads

3. **Results Page**
   - View generated ad variations
   - Customize and regenerate ads
   - Download final versions

## API Endpoints

### POST /api/generate-ad
Generate new advertisements based on reference material and brand guidelines.

**Request Body:**
```json
{
  "referenceAd": {
    "imageUrl": "string",
    "text": "string"
  },
  "brandGuidelines": {
    "colors": ["string"],
    "tone": "string",
    "targetAudience": "string",
    "style": "string"
  },
  "format": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "headline": "string",
      "subheadline": "string",
      "cta": "string",
      "imageUrl": "string",
      "format": "string",
      "style": {
        "colors": ["string"],
        "tone": "string"
      }
    }
  ]
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
