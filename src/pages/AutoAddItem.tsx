import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const AutoAddItem: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generatedContents, setGeneratedContents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [numItems, setNumItems] = useState(1);

  // Helper function to get random item from array
  const getRandomItem = (array: any[]) => array[Math.floor(Math.random() * array.length)];

  // Sample data for randomization
  const categories = ['Books', 'LEGO', 'Funko Pop', 'Diecast Cars', 'Hot Wheels'];
  const manufacturers = {
    Books: ['Penguin Books', 'HarperCollins', 'Random House', 'Simon & Schuster', 'Macmillan'],
    LEGO: ['LEGO Group', 'LEGO Star Wars', 'LEGO Marvel', 'LEGO City', 'LEGO Technic'],
    'Funko Pop': ['Funko', 'Funko Games', 'Funko Animation', 'Funko Entertainment'],
    'Diecast Cars': ['Hot Wheels', 'Matchbox', 'Maisto', 'Burago', 'Greenlight'],
    'Hot Wheels': ['Mattel', 'Hot Wheels Elite', 'Hot Wheels Premium', 'Hot Wheels RLC'],
  };
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
  const tags = {
    Books: ['Fiction', 'Non-Fiction', 'Biography', 'History', 'Science', 'Fantasy', 'Mystery'],
    LEGO: ['Star Wars', 'Marvel', 'City', 'Technic', 'Architecture', 'Creator', 'Friends'],
    'Funko Pop': ['Marvel', 'DC', 'Star Wars', 'Disney', 'Anime', 'Movies', 'TV Shows'],
    'Diecast Cars': ['Sports', 'Classic', 'Muscle', 'Super', 'Racing', 'Vintage'],
    'Hot Wheels': ['Mainline', 'Premium', 'RLC', 'Team Transport', 'Car Culture'],
  };

  const generateRandomImage = () => {
    const size = Math.floor(Math.random() * 400) + 400;
    return `https://picsum.photos/${size}/${size}`;
  };

  const handleNumItemsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 10) {
      setNumItems(value);
    }
  };

  const generateRandomContent = () => {
    const category = getRandomItem(categories);
    const manufacturer = getRandomItem(manufacturers[category as keyof typeof manufacturers]);
    const yearReleased = Math.floor(Math.random() * (2024 - 1950) + 1950);
    const condition = getRandomItem(conditions);
    const numTags = Math.floor(Math.random() * 3) + 1; // 1-3 tags
    const selectedTags = Array.from({ length: numTags }, () =>
      getRandomItem(tags[category as keyof typeof tags])
    );

    return {
      name: `${manufacturer} ${category} ${Math.floor(Math.random() * 1000)}`,
      category,
      manufacturer,
      yearReleased,
      condition,
      tags: selectedTags,
      notes: `Randomly generated ${category.toLowerCase()} item from ${manufacturer}`,
      imageUrl: generateRandomImage(),
    };
  };

  const handleGenerateContent = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate multiple random responses
      const mockResponses = Array.from({ length: numItems }, () => generateRandomContent());
      setGeneratedContents(mockResponses);
    } catch (err) {
      setError('Failed to generate content. Please try again.');
      console.error('Error generating content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || generatedContents.length === 0) return;

    try {
      const db = getFirestore();
      const itemsRef = collection(db, 'users', user.uid, 'items');

      // Save all items
      await Promise.all(
        generatedContents.map((content) =>
          addDoc(itemsRef, {
            ...content,
            userId: user.uid,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        )
      );

      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save items. Please try again.');
      console.error('Error saving items:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Auto Add Item</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-6">
          <label htmlFor="numItems" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Items to Generate (max: 10)
          </label>
          <input
            type="number"
            id="numItems"
            min="1"
            max="10"
            value={numItems}
            onChange={handleNumItemsChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <p className="mt-1 text-sm text-gray-500">
            Choose how many variations to generate (1-10)
          </p>
        </div>

        <button
          onClick={handleGenerateContent}
          disabled={loading}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Generating...
            </>
          ) : (
            'Generate Content'
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

      {generatedContents.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Generated Content</h2>
            <span className="text-sm text-gray-500">
              {generatedContents.length} item{generatedContents.length !== 1 ? 's' : ''} generated
            </span>
          </div>

          <div className="space-y-6">
            {generatedContents.map((content, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">Item {index + 1}</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-gray-900">{content.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <p className="mt-1 text-gray-900">{content.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                    <p className="mt-1 text-gray-900">{content.manufacturer}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year Released</label>
                    <p className="mt-1 text-gray-900">{content.yearReleased}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Condition</label>
                    <p className="mt-1 text-gray-900">{content.condition}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {content.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <p className="mt-1 text-gray-900">{content.notes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save All Items
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoAddItem;
