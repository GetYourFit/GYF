import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Search, Filter, Grid, List, Heart, 
  Trash2, Edit, Calendar, Tag, Sparkles, Camera, Star
} from 'lucide-react';

const Wardrobe = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];
  
  const wardrobeItems = [
    {
      id: 1,
      name: 'Classic White Shirt',
      category: 'Tops',
      brand: 'StyleCo',
      color: 'White',
      size: 'M',
      price: '$45',
      image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      dateAdded: '2024-01-15',
      timesWorn: 12,
      lastWorn: '2024-01-20',
      favorite: true,
      tags: ['Work', 'Casual', 'Versatile']
    },
    {
      id: 2,
      name: 'Black Midi Dress',
      category: 'Dresses',
      brand: 'ElegantWear',
      color: 'Black',
      size: 'S',
      price: '$89',
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      dateAdded: '2024-01-10',
      timesWorn: 8,
      lastWorn: '2024-01-18',
      favorite: true,
      tags: ['Date Night', 'Formal', 'Elegant']
    },
    {
      id: 3,
      name: 'Denim Jacket',
      category: 'Outerwear',
      brand: 'CasualTrend',
      color: 'Blue',
      size: 'M',
      price: '$65',
      image: 'https://images.pexels.com/photos/1346187/pexels-photo-1346187.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      dateAdded: '2024-01-05',
      timesWorn: 15,
      lastWorn: '2024-01-22',
      favorite: false,
      tags: ['Casual', 'Weekend', 'Layering']
    },
    {
      id: 4,
      name: 'High-Waisted Jeans',
      category: 'Bottoms',
      brand: 'DenimCo',
      color: 'Dark Blue',
      size: 'S',
      price: '$75',
      image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      dateAdded: '2024-01-08',
      timesWorn: 20,
      lastWorn: '2024-01-21',
      favorite: true,
      tags: ['Casual', 'Everyday', 'Comfortable']
    },
    {
      id: 5,
      name: 'Silk Blouse',
      category: 'Tops',
      brand: 'LuxeFashion',
      color: 'Cream',
      size: 'M',
      price: '$120',
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      dateAdded: '2024-01-12',
      timesWorn: 6,
      lastWorn: '2024-01-19',
      favorite: false,
      tags: ['Work', 'Formal', 'Luxury']
    },
    {
      id: 6,
      name: 'Ankle Boots',
      category: 'Shoes',
      brand: 'FootwearPlus',
      color: 'Brown',
      size: '8',
      price: '$95',
      image: 'https://images.pexels.com/photos/1346187/pexels-photo-1346187.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      dateAdded: '2024-01-03',
      timesWorn: 18,
      lastWorn: '2024-01-23',
      favorite: true,
      tags: ['Versatile', 'Autumn', 'Comfortable']
    }
  ];

  const filteredItems = wardrobeItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (itemId) => {
    // In a real app, this would update the backend
    console.log('Toggle favorite for item:', itemId);
  };

  const toggleSelection = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredItems.map((item) => (
        <div key={item.id} className="glass-effect rounded-2xl p-4 hover-lift group">
          <div className="relative mb-4">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-64 object-cover rounded-xl"
            />
            <div className="absolute top-3 right-3 flex space-x-2">
              <button
                onClick={() => toggleFavorite(item.id)}
                className={`p-2 backdrop-blur-sm rounded-full transition-all duration-200 ${
                  item.favorite 
                    ? 'bg-red-500/80 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`h-4 w-4 ${item.favorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => toggleSelection(item.id)}
                className={`p-2 backdrop-blur-sm rounded-full transition-all duration-200 ${
                  selectedItems.includes(item.id)
                    ? 'bg-purple-500/80 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={selectedItems.includes(item.id)}
                  onChange={() => {}}
                  className="w-4 h-4"
                />
              </button>
            </div>
            <div className="absolute bottom-3 left-3">
              <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                {item.category}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-white truncate">{item.name}</h3>
              <p className="text-purple-300 text-sm">{item.brand}</p>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Size: {item.size}</span>
              <span className="text-white font-semibold">{item.price}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Worn {item.timesWorn} times</span>
              <span>{new Date(item.lastWorn).toLocaleDateString()}</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="bg-purple-500/30 text-purple-200 text-xs px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className="text-gray-400 text-xs">+{item.tags.length - 2}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {filteredItems.map((item) => (
        <div key={item.id} className="glass-effect rounded-2xl p-6 hover-lift">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <button
                onClick={() => toggleSelection(item.id)}
                className={`absolute -top-2 -right-2 p-1 backdrop-blur-sm rounded-full transition-all duration-200 ${
                  selectedItems.includes(item.id)
                    ? 'bg-purple-500/80 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={selectedItems.includes(item.id)}
                  onChange={() => {}}
                  className="w-3 h-3"
                />
              </button>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                <p className="text-purple-300 text-sm">{item.brand}</p>
              </div>
              
              <div className="text-center">
                <p className="text-gray-300 text-sm">Category</p>
                <p className="text-white font-medium">{item.category}</p>
              </div>
              
              <div className="text-center">
                <p className="text-gray-300 text-sm">Times Worn</p>
                <p className="text-white font-medium">{item.timesWorn}</p>
              </div>
              
              <div className="text-center">
                <p className="text-gray-300 text-sm">Last Worn</p>
                <p className="text-white font-medium">{new Date(item.lastWorn).toLocaleDateString()}</p>
              </div>
              
              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    item.favorite 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${item.favorite ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="glass-effect backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">My Wardrobe</h1>
                  <p className="text-gray-400 text-sm">{filteredItems.length} items</p>
                </div>
              </div>
            </div>
            
            <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
              <Plus className="h-5 w-5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>
      </header>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="glass-effect rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your wardrobe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-gray-300/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white/10 border border-gray-300/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 appearance-none min-w-[150px]"
              >
                {categories.map((category) => (
                  <option key={category} value={category === 'All' ? '' : category} className="bg-gray-800">
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-white/10 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Selected Items Actions */}
          {selectedItems.length > 0 && (
            <div className="mt-4 flex items-center justify-between bg-purple-500/20 rounded-xl p-4">
              <span className="text-white font-medium">
                {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                  <Calendar className="h-4 w-4" />
                  <span>Create Outfit</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wardrobe Items */}
        {filteredItems.length > 0 ? (
          viewMode === 'grid' ? renderGridView() : renderListView()
        ) : (
          <div className="text-center py-20">
            <div className="glass-effect rounded-3xl p-12 max-w-md mx-auto">
              <Camera className="h-16 w-16 text-purple-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">No items found</h3>
              <p className="text-gray-300 mb-6">
                {searchQuery || selectedCategory 
                  ? "Try adjusting your search or filters" 
                  : "Start building your wardrobe by adding your first item"
                }
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                Add Your First Item
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wardrobe;