import React, { useState, useRef } from 'react';
import { fabric } from 'fabric';

const ImageEditor = ({ imageUrl, onModifications }) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [modifications, setModifications] = useState([]);
  const [selectedTool, setSelectedTool] = useState('text');
  const [textContent, setTextContent] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [textSize, setTextSize] = useState(48);
  const [filter, setFilter] = useState('none');

  // Initialize canvas when component mounts
  React.useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff'
    });
    setCanvas(canvas);

    // Load image
    fabric.Image.fromURL(imageUrl, (img) => {
      img.scaleToWidth(800);
      canvas.add(img);
      canvas.renderAll();
    });

    return () => {
      canvas.dispose();
    };
  }, [imageUrl]);

  // Handle text addition
  const handleAddText = () => {
    if (!canvas || !textContent) return;

    const text = new fabric.Text(textContent, {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: textSize,
      fill: textColor
    });

    canvas.add(text);
    canvas.renderAll();

    setModifications([...modifications, {
      type: 'text',
      text: textContent,
      x: 100,
      y: 100,
      size: textSize,
      color: textColor
    }]);
  };

  // Handle filter application
  const handleApplyFilter = () => {
    if (!canvas) return;

    const objects = canvas.getObjects();
    const image = objects[0];

    switch (filter) {
      case 'grayscale':
        image.filters.push(new fabric.Image.filters.Grayscale());
        break;
      case 'blur':
        image.filters.push(new fabric.Image.filters.Blur({ blur: 5 }));
        break;
      case 'brightness':
        image.filters.push(new fabric.Image.filters.Brightness({ brightness: 0.5 }));
        break;
      case 'contrast':
        image.filters.push(new fabric.Image.filters.Contrast({ contrast: 0.5 }));
        break;
    }

    image.applyFilters();
    canvas.renderAll();

    setModifications([...modifications, {
      type: 'filter',
      filter: filter
    }]);
  };

  // Handle crop
  const handleCrop = () => {
    if (!canvas) return;

    const objects = canvas.getObjects();
    const image = objects[0];

    // Create a rectangle for cropping
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 400,
      height: 300,
      fill: 'transparent',
      stroke: 'red',
      strokeWidth: 2
    });

    canvas.add(rect);
    canvas.renderAll();

    setModifications([...modifications, {
      type: 'crop',
      x: 100,
      y: 100,
      width: 400,
      height: 300
    }]);
  };

  // Save modifications
  const handleSave = () => {
    onModifications(modifications);
  };

  return (
    <div className="image-editor">
      <div className="tools-panel">
        <select value={selectedTool} onChange={(e) => setSelectedTool(e.target.value)}>
          <option value="text">Text</option>
          <option value="filter">Filter</option>
          <option value="crop">Crop</option>
        </select>

        {selectedTool === 'text' && (
          <div className="text-tools">
            <input
              type="text"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Enter text"
            />
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
            />
            <input
              type="number"
              value={textSize}
              onChange={(e) => setTextSize(Number(e.target.value))}
              min="12"
              max="72"
            />
            <button onClick={handleAddText}>Add Text</button>
          </div>
        )}

        {selectedTool === 'filter' && (
          <div className="filter-tools">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="none">No Filter</option>
              <option value="grayscale">Grayscale</option>
              <option value="blur">Blur</option>
              <option value="brightness">Brightness</option>
              <option value="contrast">Contrast</option>
            </select>
            <button onClick={handleApplyFilter}>Apply Filter</button>
          </div>
        )}

        {selectedTool === 'crop' && (
          <div className="crop-tools">
            <button onClick={handleCrop}>Select Crop Area</button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} />

      <div className="actions">
        <button onClick={handleSave}>Save Modifications</button>
      </div>
    </div>
  );
};

export default ImageEditor; 