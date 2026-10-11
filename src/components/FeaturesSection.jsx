import React from 'react';
import { FiFileText, FiEdit3, FiShare2, FiSearch, FiTag, FiStar, FiClock, FiUsers } from 'react-icons/fi';

const features = [
  {
    name: 'Rich Text Editing',
    description: 'Create beautiful documents with our powerful rich text editor.',
    icon: <FiEdit3 className="h-6 w-6" />,
  },
  {
    name: 'Document Organization',
    description: 'Organize your documents with folders, tags, and favorites.',
    icon: <FiFileText className="h-6 w-6" />,
  },
  {
    name: 'Real-time Collaboration',
    description: 'Work together with your team in real-time on the same document.',
    icon: <FiUsers className="h-6 w-6" />,
  },
  {
    name: 'Easy Sharing',
    description: 'Share documents with anyone using secure links.',
    icon: <FiShare2 className="h-6 w-6" />,
  },
  {
    name: 'Powerful Search',
    description: 'Find any document instantly with our advanced search feature.',
    icon: <FiSearch className="h-6 w-6" />,
  },
  {
    name: 'Tagging System',
    description: 'Categorize documents with custom tags for better organization.',
    icon: <FiTag className="h-6 w-6" />,
  },
  {
    name: 'Favorites',
    description: 'Mark important documents as favorites for quick access.',
    icon: <FiStar className="h-6 w-6" />,
  },
  {
    name: 'Version History',
    description: 'Track changes and revert to previous versions when needed.',
    icon: <FiClock className="h-6 w-6" />,
  },
];

const FeaturesSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Everything you need to create and manage documents
          </p>
          <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-500">
            Our platform provides all the tools you need to create, organize, and collaborate on documents efficiently.
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        {React.cloneElement(feature.icon, { className: 'h-6 w-6 text-white' })}
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      {feature.name}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;